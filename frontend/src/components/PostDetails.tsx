import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { setLoader } from "../redux/sliceLoader";
import { setMessageBar } from "../redux/sliceMessageBar";
import { useAppDispatch, useAppSelector } from '../redux/hookStore';

import { urlGetPost, urlPostLike } from "../api/APIs";
import { getRequest, putRequest } from "../api/APIManager";

import { motion } from "framer-motion";
import { X, Heart, MessageCircle, Download, Share2 } from "lucide-react";

import type { Post } from "../models/modelPosts";
import ProfilePlaceholder from "../assets/images/ProfilePlaceholder.png";

function PostDetails() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { postId } = useParams();

  const user = useAppSelector((state) => state.user);
  const { isLoading } = useAppSelector((state) => state.loader);

  const [post, setPost] = useState<Post | null>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  async function GetPost() {
    dispatch(setLoader({ isLoading: true }));

    let url = `${urlGetPost}?postId=${postId}`;
    if (user) url += `&userId=${user.id}`;
    const { data, error } = await getRequest<Post>(url);

    if (error || !data) {
      dispatch(setLoader({ isLoading: false }));
      return;
    }

    const postData = data as Post;

    setPost(postData);
    setIsLiked(postData.isLiked);
    setLikes(Array.isArray(postData.likes) ? postData.likes.length : postData.likes);
    // setCommentCount(postData.comments ?? 0);
    dispatch(setLoader({ isLoading: false }));
  }

  async function DownloadMedia(post: Post) {
    try {
      const response = await fetch(post.media_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `post-${post.id}.${blob.type.split("/")[1] || "jpg"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log("Download failed", err);
    }
  }

  async function LikePost() {
    if (!post) return;

    if (!user) {
      dispatch(setMessageBar({ message: "Please login to like posts.", color: "yellow" }));
      return;
    }

    const oldLiked = isLiked;
    const oldLikes = likes;
    setIsLiked(!oldLiked);
    setLikes(oldLiked ? oldLikes - 1 : oldLikes + 1);

    const { error } = await putRequest(`${urlPostLike}?id=${post.id}`);

    if (!error) return;

    setIsLiked(oldLiked);
    setLikes(oldLikes);
  }

  function copyLink(post: Post) {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        dispatch(setMessageBar({ message: "Post link copied to clipboard!", color: "yellow" }));
      })
      .catch((err) => {
        console.log("Error while copyLink:", err);
        dispatch(setMessageBar({ message: "Failed to copy post link!", color: "red" }));
      });
  }

  const createdDate = useMemo(() => {
    if (!post) return "";
    return new Date(post.created_at).toLocaleDateString();
  }, [post]);

  useEffect(() => {
    GetPost();
  }, [postId]);

  function UINoPost() {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="fixedinset-0px-4flexitems-centerjustify-center">

          <motion.div
            initial={{ opacity: 0, scale: .8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-8 text-center text-white"
          >
            <h2 className=" text-2xl font-bold mb-4">
              Post vanished 👻
            </h2>

            <p className=" text-sm text-gray-400">
              This post might have been
              deleted or moved to another
              dimension.
            </p>

            <button
              onClick={() => navigate(-1)}
              className="mt-6 px-5 py-3 rounded-xl bg-cyan-500"
            >
              Go Back
            </button>

          </motion.div>

        </div>
      </div>
    );
  }

  if (isLoading) return null;
  if (!post) return <UINoPost />;

  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 overflow-y-auto custom-scroll text-white px-3 sm:px-5 py-5 z-50"
    >

      {/* Close */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: .95 }}
        onClick={() => navigate(-1)}
        className="fixed top-5 right-5 z-50 p-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-md hover:bg-black/60"
      >
        <X size={20} />
      </motion.button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-black/25 backdrop-blur-md shadow-2xl p-5 sm:p-8"
      >

        {/* HEADER */}
        <div className="flex justify-between items-start gap-4 pb-5 border-b border-white/10">

          <h1 className="text-2xl sm:text-4xl font-bold leading-tight break-words flex-1">
            {post.post_title}
          </h1>

          <div className="text-xs text-white/50 whitespace-nowrap pt-1">
            {createdDate}
          </div>

        </div>

        {/* USER */}
        <div className="flex items-center gap-3 mt-5">

          <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20 shrink-0">
            <img
              src={post.user_image_url || ProfilePlaceholder}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="font-medium text-base">
            {post.username || "Unknown User"}
          </div>

        </div>

        {/* MEDIA */}
        {post.media_url && (

          <div className="mt-6 relative rounded-3xl overflow-hidden bg-black/40 border border-white/10">

            <div className="flex justify-center items-center max-h-[70vh] p-2">
              <img
                src={post.media_url}
                className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-2xl"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: .9 }}
              onClick={() => DownloadMedia(post)}
              className="absolute bottom-4 right-4 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/70 text-white"
            >
              <Download size={18} />
            </motion.button>

          </div>

        )}

        {/* BODY */}
        <div className="mt-7 text-[15px] sm:text-base leading-8 text-white/90 whitespace-pre-wrap break-words">
          {post.post_body}
        </div>

        {/* STATS */}
        <div className="mt-7 flex justify-between items-center flex-wrap gap-4 border-y border-white/10 py-4">
          <div className="flex gap-6">

            <motion.button
              disabled={!user}
              onClick={LikePost}
              whileTap={{ scale: 1.2 }}
              whileHover={{ scale: .95 }}
              className={`flex items-center gap-2 transition-all
              ${isLiked ? "text-red-500" : user ? "text-white/80 hover:text-red-400" : "text-white/30 cursor-default"}`}
            >

              <Heart
                size={18}
                className={`transition-all ${isLiked ? "fill-red-500" : "fill-transparent"}`}
              />

              <span>{likes}</span>

            </motion.button>

            <div className="flex items-center gap-2 text-cyan-400">
              <MessageCircle size={18} />
              <span>{post.comments ?? 0}</span>
            </div>

            <motion.button className={`flex items-center gap-1 transition-colors duration-200 hover:text-orange-400`}
              onClick={() => copyLink(post)}
              whileTap={{ scale: 1.2 }}
              whileHover={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}>
              <Share2 className={`w-4 h-4 transition-all duration-200 fill-transparent`} />
            </motion.button>

          </div>

          <div className="px-4 py-1.5 rounded-full text-sm bg-cyan-500/10 text-cyan-400">
            {post.category}
          </div>
        </div>

      </motion.div>

    </motion.div>
  );
}

export default React.memo(PostDetails);
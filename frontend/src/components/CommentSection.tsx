import React, { useEffect, useState, useRef } from "react";
import { X, Trash } from "lucide-react";

import { setMessage } from "../redux/sliceMessageBar";
import { useAppDispatch, useAppSelector } from "../redux/hookStore";

import { urlcomment } from "../api/APIs";
import { getRequest, deleteRequest, postRequest } from "../api/APIManager";
import { type Comment, type CommentData } from "../models/modelComment";

import Alert from "./Alert";
import GetMessage from "../utils/MessagesManager";

type Props = {
    postId: number;
    onClose: () => void;
    UpdateComment: (isUserComment: boolean, amount: number) => void;
};

const CommentSection = ({ postId, onClose, UpdateComment }: Props) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentInput, setCommentInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [currPage, setCurrPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteCallback, setDeleteCallback] = useState<() => void>(() => () => { });

    function handleScroll() {
        const el = scrollRef.current;
        if (!el || isFetchingMore || currPage >= totalPages) return;

        if (el.scrollHeight - el.scrollTop <= el.clientHeight + 20) {
            fetchComments(currPage + 1);
        }
    };

    function ShowMsg(message: string, color: string) {
        dispatch(setMessage({ message, color }));
    }

    async function fetchComments(page = 1) {
        if (page > totalPages) return;

        if (page === 1) setLoading(true);
        else setIsFetchingMore(true);

        const { data } = await getRequest<CommentData>(`${urlcomment}?id=${postId}&page=${page}`);

        if (data) {
            setComments(prev => page === 1 ? data.comments : [...prev, ...data.comments]);
            setCurrPage(data.currPage);
            setTotalPages(data.totalPages);
        }

        setLoading(false);
        setIsFetchingMore(false);
    };

    async function handleAddComment() {
        if (commentInput.length < 2) {
            ShowMsg(GetMessage('commentLess'), 'red');
            return;
        }
        else if (commentInput.length > 500) {
            ShowMsg(GetMessage('commentMore'), 'red');
            return;
        }

        const body = {
            postId: postId,
            comment: commentInput,
        }

        const { data, error } = await postRequest<string>(urlcomment, body);
        if (data) {
            setCommentInput('');
            const newComment = {
                id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
                comment: commentInput,
                username: user.username,
                user_image_url: user.image_url,
                isUserComment: true,
                created_at: new Date(Date.now()).toLocaleDateString()
            };
            UpdateComment(true, 1);
            setComments(prev => [newComment, ...prev]);

            ShowMsg(GetMessage('commentAdded'), 'green');
        }
        else {
            ShowMsg(error, 'red');
        }
    };

    async function handleDeleteComment(id: number) {
        await deleteRequest<string>(`${urlcomment}?id=${id}`);
        UpdateComment(true, -1);
        setComments((prev) => prev.filter((c) => c.id !== id));
    };

    useEffect(() => {
        setComments([]);
        setCurrPage(1);
        setTotalPages(1);
        fetchComments(1);
    }, [postId]);

    return (
        <div className="mt-4 w-full bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 bg-black/50 backdrop-blur sticky top-0 z-10">
                <h2 className="text-white text-base font-semibold tracking-wide">💬 Comments</h2>
                <button onClick={onClose} className="text-white/60 hover:text-red-400 transition">
                    <X size={20} />
                </button>
            </div>

            {/* Scrollable Comments */}
            <div className="max-h-72 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                ref={scrollRef}
                onScroll={handleScroll}>
                {loading ? (
                    <p className="text-white/50 text-sm text-center">Loading...</p>
                ) : comments.length === 0 ? (
                    <p className="text-white/50 text-sm text-center">No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-gradient-to-r from-white/10 to-white/5 p-3 rounded-xl border border-white/10 flex flex-col"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-medium text-sm text-white">{comment.username}</div>
                                    <div className="text-white/90 text-sm mt-1 whitespace-pre-wrap break-words w-full break-all">
                                        {comment.comment}
                                    </div>
                                </div>
                                {comment.isUserComment && (
                                    <button
                                        onClick={() => {
                                            setDeleteCallback(() => () => handleDeleteComment(comment.id));
                                            setShowConfirm(true);
                                        }}
                                        className="text-red-500 hover:text-red-600 ml-2"
                                    >
                                        <Trash size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="text-white/40 text-xs mt-2 text-right">
                                {new Date(comment.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="px-4 py-3 border-t border-white/10 bg-black/50 backdrop-blur sticky bottom-0 z-10">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm bg-black/30 rounded-lg border border-white/20 text-white placeholder-white/50 outline-none"
                    />
                    <button
                        onClick={handleAddComment}
                        className="px-4 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-lg hover:bg-cyan-600 transition">
                        Comment
                    </button>
                </div>
            </div>

            <Alert
                isOpen={showConfirm}
                message="Are you sure you want to delete this comment?"
                onClose={() => setShowConfirm(false)}
                onConfirm={deleteCallback}
            />

        </div>
    );
};

export default React.memo(CommentSection);
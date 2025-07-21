import React, { useState, useEffect, useRef } from "react";
import { urlCategories } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { type Categories } from '../../models/modelCategories';
import { type User } from "../../models/modelUser";
import GetMessage from "../../utils/MessagesManager";

type AuthCategoriesProps = {
    ShowMsg: (msg: string, color?: string) => void;
    SetUser: (user: User) => void;
    user: User;
};

function AuthCategories({ ShowMsg, SetUser, user }: AuthCategoriesProps) {
    const [isStartAnim, setIsStartAnim] = useState<boolean>(false);
    const [isEndAnim, setIsEndAnim] = useState<boolean>(false);

    const [currPage, setCurrPage] = useState<number>(1);
    const [isShowMore, setIsShowMore] = useState<boolean>(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categoriesData, setCategoriesData] = useState<Record<string, string[]>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const loadingRef = useRef<boolean>(false);

    function ButtonContinue() {
        if (selectedCategories.length < 1) {
            ShowMsg(GetMessage('categorySelect'), 'red');
            return;
        }

        setIsEndAnim(true);

        const updatedUser: User = {
            ...user,
            categories: selectedCategories,
        };

        setTimeout(() => {
            ShowMsg('');
            SetUser(updatedUser);
        }, 500);
    }

    function ToggleSection(section: string) {
        const items = categoriesData[section] || [];
        const allSelected = items.every(item => selectedCategories.includes(item));

        setSelectedCategories(prev => {
            if (allSelected) {
                return prev.filter(cat => !items.includes(cat));
            } else {
                const newSet = new Set(prev);
                items.forEach(item => newSet.add(item));
                return Array.from(newSet);
            }
        });
    }

    function ToggleCategory(category: string) {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    }

    async function LoadCategories(page: number) {
        if (!isShowMore || loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);

        const { data, error } = await getRequest<Categories>(`${urlCategories}?page=${page}`);
        if (data) {
            setCurrPage(page);
            setIsShowMore(page < data.totalPages);
            setCategoriesData(prev => {
                const updated = { ...prev };
                for (const key in data.categories) {
                    const existing = new Set(updated[key] ?? []);
                    data.categories[key].forEach(item => existing.add(item));
                    updated[key] = Array.from(existing);
                }
                return updated;
            });
        } else {
            ShowMsg(error, 'red');
        }

        setIsLoading(false);
        loadingRef.current = false;
    }

    useEffect(() => {
        setTimeout(() => { setIsStartAnim(true); }, 5);
        LoadCategories(1);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || isLoading || !isShowMore) return;

            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            if (scrollHeight - scrollTop <= clientHeight + 100) {
                LoadCategories(currPage + 1);
            }
        };

        const current = containerRef.current;
        current?.addEventListener('scroll', handleScroll);
        return () => current?.removeEventListener('scroll', handleScroll);
    }, [currPage, isShowMore, isLoading]);

    function UICategories() {
        return (
            <div className="space-y-6">
                {Object.entries(categoriesData).map(([section, items]) => {
                    const allSelected = items.every(item => selectedCategories.includes(item));

                    return (
                        <div key={section} className="bg-white/10 p-4 rounded-xl shadow-md border border-white/20 w-full">
                            <h2
                                onClick={() => ToggleSection(section)}
                                className={`text-lg font-bold mb-4 select-none cursor-pointer transition duration-200 ${allSelected ? "text-cyan-400" : "text-white hover:text-purple-400"
                                    }`}>
                                {section}
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {items.map((item, idx) => (
                                    <span
                                        key={idx}
                                        onClick={() => ToggleCategory(item)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition select-none cursor-pointer
                                            ${selectedCategories.includes(item)
                                                ? "bg-purple-600 text-white"
                                                : "bg-pink-600 text-white hover:bg-pink-700"}`}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    function CategorySkeleton() {
        return (
            <div className="bg-white/10 p-4 rounded-xl shadow-md border border-white/20 w-full animate-pulse space-y-3">
                <div className="h-5 bg-white/30 rounded w-1/3" />
                <div className="flex flex-wrap gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-6 w-20 bg-white/20 rounded-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none select-none">
            <div
                className={`w-full max-w-4xl h-[95vh] px-6 pt-6 pb-0 rounded-2xl bg-black/25 backdrop-blur-sm
                pointer-events-auto shadow-lg relative overflow-hidden flex flex-col
                transform transition-all duration-1000 ease-in-out
                ${isEndAnim ? "opacity-0 -translate-x-full" : isStartAnim ? "opacity-100 translate-y-0" : "opacity-0 translate-x-full"}`}>

                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scroll"
                >
                    {UICategories()}
                    {isLoading && <CategorySkeleton />}
                </div>

                <div className="py-2 px-2 flex justify-end items-center rounded-b-2xl">
                    <button
                        onClick={ButtonContinue}
                        disabled={false}
                        className={`text-white text-sm font-semibold py-2 px-4 rounded-lg mt-1 transition bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700`}>
                        Continue
                    </button>
                </div>

            </div>
        </div>
    );
}

export default React.memo(AuthCategories);
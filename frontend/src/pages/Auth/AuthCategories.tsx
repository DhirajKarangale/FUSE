import React, { useState, useEffect, useRef, useTransition } from "react";
import { urlCategories } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { type Categories } from '../../models/modelCategories';
import { type User } from "../../models/modelUser";
import GetMessage from "../../utils/MessagesManager";
import { motion } from "framer-motion";

type AuthCategoriesProps = {
  ShowMsg: (msg: string, color?: string) => void;
  SetUser: (user: User) => void;
  user: User;
};

const CategorySection = React.memo(({ section, items, selectedCategories, ToggleSection, ToggleCategory }: {
  section: string;
  items: string[];
  selectedCategories: string[];
  ToggleSection: (section: string) => void;
  ToggleCategory: (item: string) => void;
}) => {
  const allSelected = items.every(item => selectedCategories.includes(item));

  return (
    <div className="bg-white/10 p-4 sm:p-5 rounded-xl shadow-md border border-white/20 w-full">
      <h2
        onClick={() => ToggleSection(section)}
        className={`text-base sm:text-lg font-bold mb-4 select-none cursor-pointer transition duration-200 ${allSelected ? "text-cyan-400" : "text-white hover:text-purple-400"
          }`}
      >
        {section}
      </h2>

      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span
            key={idx}
            onClick={() => ToggleCategory(item)}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition select-none cursor-pointer break-words max-w-full truncate ${selectedCategories.includes(item)
              ? "bg-purple-600 text-white"
              : "bg-pink-600 text-white hover:bg-pink-700"
              }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
});

function AuthCategories({ ShowMsg, SetUser, user }: AuthCategoriesProps) {
  const [currPage, setCurrPage] = useState<number>(1);
  const [isShowMore, setIsShowMore] = useState<boolean>(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoriesData, setCategoriesData] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<boolean>(false);
  const [_isPending, startTransition] = useTransition();

  function ButtonContinue() {
    if (selectedCategories.length < 1) {
      ShowMsg(GetMessage('categorySelect'), 'red');
      return;
    }

    const updatedUser: User = {
      ...user,
      categories: selectedCategories,
    };

    SetUser(updatedUser);
  }

  function ToggleSection(section: string) {
    const items = categoriesData[section] || [];
    const allSelected = items.every(item => selectedCategories.includes(item));

    startTransition(() => {
      setSelectedCategories(prev => {
        if (allSelected) {
          return prev.filter(cat => !items.includes(cat));
        } else {
          const newSet = new Set(prev);
          items.forEach(item => newSet.add(item));
          return Array.from(newSet);
        }
      });
    });
  }

  function ToggleCategory(category: string) {
    startTransition(() => {
      setSelectedCategories(prev =>
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    });
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
      <motion.div
        key="auth-categories"
        initial={{ opacity: 0, scale: 0.8, x: 200 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: -200 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-[95vw] sm:max-w-4xl h-[95vh] px-4 sm:px-6 pt-4 sm:pt-6 pb-0 rounded-2xl bg-black/25 backdrop-blur-sm pointer-events-auto shadow-lg relative overflow-hidden flex flex-col"
      >
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scroll space-y-6"
        >
          {Object.entries(categoriesData).map(([section, items]) => (
            <CategorySection
              key={section}
              section={section}
              items={items}
              selectedCategories={selectedCategories}
              ToggleSection={ToggleSection}
              ToggleCategory={ToggleCategory}
            />
          ))}
          {isLoading && <CategorySkeleton />}
        </div>

        <div className="py-2 px-2 flex justify-end items-center rounded-b-2xl">
          <button
            onClick={ButtonContinue}
            className="text-white text-sm font-semibold py-2 px-4 rounded-lg mt-1 transition bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default React.memo(AuthCategories);

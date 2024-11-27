import { ITEMS_PER_PAGE } from "@/constants";
import { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import api from "../utils/api";


interface AdminManageContentLayoutProps {
    children: React.ReactNode;
    totalPages: number;
    onUpdate?: (query: string, page: number) => void;
  }

const AdminManageContentLayout: React.FC<AdminManageContentLayoutProps> = ({ children, totalPages, onUpdate }) => {

    const [searchQuery, setSearchQuery] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [page, setPage] = useState(1);


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        onUpdate && onUpdate(searchQuery, page);
    }, [searchQuery, page]);

    return (
        <><div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-lg w-full md:w-1/2 mx-auto mb-4">
                <HiOutlineSearch className="text-gray-400 ml-2" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Enter keywords..."
                    className="w-full p-2 text-sm bg-transparent focus:outline-none ml-2 text-gray-700 dark:text-gray-300" />
            </div>
        </div><div className="mt-8">
                {children}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 dark:text-gray-300">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div></>
    );
};

export default AdminManageContentLayout;
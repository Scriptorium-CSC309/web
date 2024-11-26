import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState("Admin Home");
  const router = useRouter();

  const sidebarItems = [
    { id: "Admin Home", label: "Admin Home", route: "/site-admin" },
    { id: "Manage Posts", label: "Manage Posts", route: "/site-admin/manage-blogposts" },
    { id: "Manage Code Templates", label: "Manage Code Templates", route: "/site-admin/manage-templates" }
  ];

  useEffect(() => {
    const currentItem = sidebarItems.find(item => item.route === router.pathname);
    if (currentItem) {
      setSelectedItem(currentItem.id);
    }
  }, [router.pathname]);

  const handleItemClick = (item: string, route: string) => {
    setSelectedItem(item);
    router.push(route);
  };

  return (
    <div className="dark:bg-gray-900">
    <div className="bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 py-4 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700">
        <h2 className="text-2xl font-bold text-white text-left ml-4">Admin Portal</h2>
    </div>
    <div className="flex flex-col md:flex-row h-screen">
        <aside className="w-full md:w-1/5 bg-gray-800 text-white h-full p-4 bg-gradient-to-r from-gray-500 to-gray-400 py-4 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700">
            <ul>
                {sidebarItems.map((item) => (
                    <li
                        key={item.id}
                        className={`mb-4 p-2 rounded-md cursor-pointer ${selectedItem === item.id ? "bg-gray-700 dark:bg-gray-900" : "hover:bg-gray-700"}`}
                        onClick={() => handleItemClick(item.id, item.route)}
                    >
                        <a href="#" className="text-lg font-semibold hover:text-gray-300">{item.label}</a>
                    </li>
                ))}
            </ul>
        </aside>
        <main className="flex-1 p-4 pt-20 min-h-screen overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

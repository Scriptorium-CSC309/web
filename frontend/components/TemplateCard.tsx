import React from "react";
import { useRouter } from "next/router";
import Avatar from "./Avatar"; // Assuming Avatar is a reusable component.
import LanguageIcon from "./LanguageIcon"; // Assuming LanguageIcon is a reusable component.

interface TemplateCardProps {
    template: {
      id: number;
      title: string;
      description: string;
      language: string;
      tags: { name: string }[];
      user: {
        id: number;
        name: string;
        avatarId: number;
      };
    };
  }

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const router = useRouter();

  const handleTemplateClick = (id: number) => {
    router.push(`/code-templates/${id}`);
  };

  return (
    <div
      key={template.id}
      className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer gap-4 mx-auto md:flex-row"
      onClick={() => handleTemplateClick(template.id)}
    >
      {/* Left: Avatar and User Info */}
      <div className="flex items-center gap-4 md:w-1/4 md:flex-col md:items-start">
        <Avatar
          avatarId={template.user.avatarId}
          width={50}
          height={50}
          className="rounded-full"
        />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center md:text-left">
          {template.user.name}
        </h3>
      </div>

      {/* Center: Description and Title */}
      <div className="flex flex-col flex-grow md:w-2/4 text-center md:text-left">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {template.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {template.description || "No description provided."}
        </p>
      </div>

      {/* Right: Tags and Language */}
      <div className="flex flex-col items-center gap-2 md:w-1/4 md:items-end mt-4 md:mt-0">
        <div className="flex items-center gap-2">
          <LanguageIcon language={template.language} />
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {template.language}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-end">
          {template.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-200"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;

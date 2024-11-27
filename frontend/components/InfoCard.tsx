const InfoCard: React.FC<{ title: string; number: number }> = ({ title, number }) => {
    return (
      <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-500 p-4 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{number}</p>
      </div>
    );
  };

export default InfoCard;
const QueryNotFoundMessage = ({ message }: { message: string }) => {
  return (
    <div className="bg-white text-3xl font-medium text-gray-500 m-6 p-3 md:p-20 border border-gray-300/70 text-center rounded-md">
      {message}
    </div>
  );
};

export default QueryNotFoundMessage;

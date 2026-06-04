const QueryNotFoundMessage = ({ message }: { message: string }) => {
  return (
    <div className="bg-card text-lg font-medium text-muted-foreground m-6 p-10 md:p-16 border border-border/50 text-center rounded-xl shadow-sm">
      {message}
    </div>
  );
};

export default QueryNotFoundMessage;

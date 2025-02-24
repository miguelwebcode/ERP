type SharedButtonProps = {
  text: string;
  onClick: () => void;
  className?: string;
};

export const SharedButton = ({
  text,
  onClick: handleClick,
  className,
}: SharedButtonProps) => {
  return (
    <button
      className={`bg-blue-500 hover:bg-blue-600 text-white font-bold uppercase p-2 rounded-lg ${
        className && className
      } `}
      onClick={() => {
        handleClick();
      }}
    >
      {text}
    </button>
  );
};

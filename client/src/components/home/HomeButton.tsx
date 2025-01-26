type SharedButtonProps = {
  text: string;
  handleClick: () => void;
  className?: string;
};

export const SharedButton = ({
  text,
  handleClick,
  className,
}: SharedButtonProps) => {
  return (
    <button
      className={`bg-blue-500 hover:bg-blue-600 text-white font-bold uppercase p-3 rounded-lg ${
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

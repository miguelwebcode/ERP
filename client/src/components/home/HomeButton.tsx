type HomeButtonProps = {
  text: string;
  handleClick: () => void;
  className?: string;
};

export const HomeButton = ({
  text,
  handleClick,
  className,
}: HomeButtonProps) => {
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

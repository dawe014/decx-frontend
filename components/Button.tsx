type Buttonprops = {
  children: string;
  btnStyle: string;
};

export default function Button({ children, btnStyle }: Buttonprops) {
  return (
    <button
      className={`${btnStyle}  flex items-cent font-bold rounded-full px-4 py-2 my-3`}
    >
      <span>{children}</span>
    </button>
  );
}

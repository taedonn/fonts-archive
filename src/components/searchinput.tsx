const defaultSearchInput = {
  onkeyup: (e: React.KeyboardEvent<HTMLInputElement>) => {
    return;
  },
  placeholder: "",
  marginTop: 0,
  value: "",
  color: "",
};

interface SearchInput {
  onkeyup?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  id: string;
  placeholder?: string;
  marginTop?: number;
  value?: string;
  color?: string;
}

export default function SearchInput({
  onkeyup = defaultSearchInput.onkeyup,
  id,
  placeholder = defaultSearchInput.placeholder,
  marginTop = defaultSearchInput.marginTop,
  value = defaultSearchInput.value,
  color = defaultSearchInput.color,
}: SearchInput) {
  return (
    <input
      onKeyUp={onkeyup}
      type="text"
      id={id}
      placeholder={placeholder}
      style={{ marginTop: marginTop + "rem" }}
      defaultValue={value}
      className={`${
        color === "" ? "bg-l-e dark:bg-d-4" : "bg-l-f dark:bg-d-3"
      } w-80 px-3.5 py-3 text-base rounded-lg border-2 border-transparent focus:border-h-1 focus:dark:border-f-8 text-l-2 dark:text-white placeholder:text-l-5 dark:placeholder:text-d-c`}
    />
  );
}

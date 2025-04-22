
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  placeholder?: string;
}

export const PasswordInput = ({
  value,
  onChange,
  id,
  placeholder,
  ...props
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow((prev) => !prev);

  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="current-password"
        {...props}
        className="pr-10"
      />
      <button
        type="button"
        aria-label={show ? "Cacher le mot de passe" : "Afficher le mot de passe"}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
        tabIndex={-1}
        onClick={handleToggle}
      >
        {show ? (
          <Eye color="#ea384c" size={22} />
        ) : (
          <EyeOff color="#8E9196" size={22} />
        )}
      </button>
    </div>
  );
};

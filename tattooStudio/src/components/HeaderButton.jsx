import { useNavigate } from "react-router-dom";

function HeaderButton({ path, title, className, onClick }) {
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (onClick) {
      onClick();
    }
    navigate(path);
  };

  return (
    <div className={className} onClick={() => handleClick(path)}>
      {title}
    </div>
  );
}

export default HeaderButton;

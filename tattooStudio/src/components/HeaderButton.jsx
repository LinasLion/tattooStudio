import { useNavigate } from "react-router-dom";

function HeaderButton({ path, title, className }) {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className={className} onClick={() => handleClick(path)}>
      {title}
    </div>
  );
}

export default HeaderButton;

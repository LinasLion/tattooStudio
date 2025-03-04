import { useNavigate } from "react-router-dom";

function HeaderButton({ path, title, className }) {
  const navigate = useNavigate();

  function handleClick(argumento) {
    navigate(argumento);
  }

  return (
    <div className={className} onClick={() => handleClick(path)}>
      {title}
    </div>
  );
}

export default HeaderButton;

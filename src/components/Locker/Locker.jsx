import PropTypes from "prop-types";
import "./Locker.css";

const Locker = ({ status, onClick }) => {
  return (
    <div
      className={`locker ${status}`}
      onClick={onClick}
    >
      {status.charAt(0).toUpperCase()}
    </div>
  );
};

Locker.propTypes = {
  onClick: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

export default Locker;

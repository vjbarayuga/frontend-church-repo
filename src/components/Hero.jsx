import PropTypes from "prop-types";

export default function Hero({ title, subtitle, backgroundImage }) {
  return (
    <div
      className="relative h-[60vh] bg-cover bg-center"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <div className="absolute inset-0 bg-black/50">
        <div className="h-full flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl font-bold mb-4 text-center px-4">{title}</h1>
          <p className="text-xl max-w-2xl text-center px-4">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired,
};

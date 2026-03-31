import { Html, useProgress } from "@react-three/drei";

// Loader while canvas (model) is loading
const Loader = () => {
  const { progress } = useProgress(); // use drei progress

  return (
    <Html as='div' center>
      <div className="loader-container">
        <span className='canvas-loader'></span>
        <p className="loader-progress-text">{progress.toFixed(2)}%</p>
      </div>
    </Html>
  );
};

export default Loader;

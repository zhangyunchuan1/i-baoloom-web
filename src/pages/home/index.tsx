import React from 'react';
import './index.scss';
import ArticaleCard from '../../components/ArticaleCard';

const HomePage: React.FC = (props) => {
  return (
    <div className="page-home">
      <ArticaleCard />
      <ArticaleCard />
      <ArticaleCard />
      <ArticaleCard />
      <ArticaleCard />
      <ArticaleCard />
    </div>
  );
};

export default HomePage;

import React from 'react';
import router from './router/routes';
import { RouterProvider } from 'react-router-dom';

const App: React.FC = () => {
  console.log('📌 动态路由数据');
  console.dir(router);
  
  return (
    <RouterProvider router={router} />
  );
};

export default App;
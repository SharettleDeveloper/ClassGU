'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";
import Loading from "../Element/Loading";
import Box from "@mui/material/Box";
import AppBar1 from "../AppBar/AppBar1";
import SearchPage from "../Search/SearchPage";
import { useBackground } from "@/app/Context/BackgroundContext";
import { ProfileProvider } from "../AppBar/ProfileContext";
import CardGallery from "./CardGarary";
import { ClassProvider } from "@/app/Context/ClassContext";

const Dashboard = (): JSX.Element => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const { backgroundUrl, backgroundSize, positionX, positionY } = useBackground();  // positionX と positionY を取得

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, loading, router]);

  if (loading || (!loading && !currentUser)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Loading />
      </Box>
    );
  }
  

  return (
    <>
      <ProfileProvider>
        <ClassProvider>


        <AppBar1>
          <Box
            textAlign="center"
            mt={0}
            sx={{
              backgroundImage: `url(${backgroundUrl})`,
              backgroundSize: backgroundSize, // 画像サイズを反映
              backgroundPosition: `${positionX} ${positionY}`, // positionX と positionY を組み合わせて反映
              backgroundRepeat: 'no-repeat', // 繰り返しなしで表示
              minHeight: '100vh', // ビューポート全体をカバー
              padding: '0px',
            }}
          >
            <SearchPage />
          <CardGallery/>
          </Box>
        </AppBar1>
        </ClassProvider>
      </ProfileProvider>
    </>
  );
};

export default Dashboard;

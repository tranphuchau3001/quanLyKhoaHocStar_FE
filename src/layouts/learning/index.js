import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListIcon from "@mui/icons-material/List";
import PageLayout from "examples/LayoutContainers/PageLayout";
import MDButton from "components/MDButton";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";

const courseContent = [
  {
    id: 1,
    label: "Giới thiệu",
    icon: <ListIcon />,
    videos: [
      {
        id: 1,
        title: "Video giới thiệu",
        url: "https://www.youtube.com/embed/bZjQq_T1hDE?showinfo=0&rel=0",
      },
    ],
  },
  {
    id: 2,
    label: "Nội dung",
    icon: <ListIcon />,
    videos: [
      {
        id: 2,
        title: "Tìm hiểu về HTML, CSS",
        url: "https://www.youtube.com/embed/jlCSd2mUynI?showinfo=0&rel=0",
      },
      {
        id: 3,
        title: "Làm quen với Dev tools",
        url: "https://www.youtube.com/embed/QAFJliCcvL8?showinfo=0&rel=0",
      },
      {
        id: 4,
        title: "Cài đặt VS Code",
        url: "https://www.youtube.com/embed/GEHUIid1pks?showinfo=0&rel=0",
      },
    ],
  },
  {
    id: 3,
    label: "Bài tập",
    icon: <ListIcon />,
    videos: [
      {
        id: 5,
        title: "Bài 1",
        url: "https://www.youtube.com/embed/kIn5KHLl4Us?showinfo=0&rel=0",
      },
    ],
  },
];

function Learning() {
  const [open, setOpen] = useState({});
  const [currentVideo, setCurrentVideo] = useState(courseContent[0].videos[0].url);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Chỉ số video hiện tại

  const handleClick = (index) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
  };

  const handleVideoChange = (url, videoId, index) => {
    setCurrentVideo(url);
    setSelectedVideoId(videoId);
    setCurrentVideoIndex(index);
  };

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      const previousVideo = courseContent.flatMap((item) => item.videos)[currentVideoIndex - 1];
      handleVideoChange(previousVideo.url, previousVideo.id, currentVideoIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentVideoIndex < courseContent.flatMap((item) => item.videos).length - 1) {
      const nextVideo = courseContent.flatMap((item) => item.videos)[currentVideoIndex + 1];
      handleVideoChange(nextVideo.url, nextVideo.id, currentVideoIndex + 1);
    }
  };

  return (
    <PageLayout>
      <DefaultNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} pt={6}>
          <Grid item xs={12}>
            <Grid container spacing={6} padding={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <MDBox sx={{ position: "relative", paddingTop: "56.25%" }}>
                    <iframe
                      title="Video giới thiệu"
                      src={currentVideo}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </MDBox>
                  <MDBox
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}
                  >
                    <MDButton
                      variant="contained"
                      color="info"
                      onClick={handlePrevious}
                      disabled={currentVideoIndex === 0}
                      sx={{ marginRight: 2, padding: "10px 20px" }}
                    >
                      <ArrowCircleLeftOutlinedIcon sx={{ marginRight: 1 }} /> Bài trước
                    </MDButton>
                    <MDButton
                      variant="contained"
                      color="info"
                      onClick={handleNext}
                      disabled={
                        currentVideoIndex ===
                        courseContent.flatMap((item) => item.videos).length - 1
                      }
                      sx={{ padding: "10px 20px" }}
                    >
                      Bài tiếp theo <ArrowCircleRightOutlinedIcon sx={{ marginLeft: 1 }} />
                    </MDButton>
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDTypography variant="h5" color="white" textAlign="center">
                      Khóa Học: tên khóa học
                    </MDTypography>
                  </MDBox>
                  <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Nội dung khóa học
                      </ListSubheader>
                    }
                  >
                    {courseContent.map((item, index) => (
                      <div key={item.id}>
                        <ListItemButton onClick={() => handleClick(index)}>
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.label} />
                          {open[index] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open[index]} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {item.videos.map((subItem) => (
                              <ListItemButton
                                key={subItem.id}
                                sx={{
                                  pl: 4,
                                  backgroundColor:
                                    selectedVideoId === subItem.id ? "lightblue" : "transparent",
                                }}
                                onClick={() =>
                                  handleVideoChange(subItem.url, subItem.id, currentVideoIndex)
                                }
                              >
                                <ListItemText primary={subItem.title} />
                              </ListItemButton>
                            ))}
                          </List>
                        </Collapse>
                      </div>
                    ))}
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </PageLayout>
  );
}

export default Learning;

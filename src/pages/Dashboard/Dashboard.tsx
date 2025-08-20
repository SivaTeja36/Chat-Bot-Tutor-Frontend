import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  LinearProgress,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp,
  School,
  Quiz,
  AccessTime as Timer,
  Star,
  EmojiEvents,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { kidsAPI } from "../../services/api";
import { GetKidResponse, GetQuestionsHistoryResponse } from "../../types/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [kids, setKids] = useState<GetKidResponse[]>([]);
  const [questionHistory, setQuestionHistory] = useState<{
    [key: number]: GetQuestionsHistoryResponse[];
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kidsResponse = await kidsAPI.getAllKids();
        setKids(kidsResponse.data.data);

        const historyPromises = kidsResponse.data.data.map((kid) =>
          kidsAPI.getQuestionsHistory(kid.id)
        );
        const historyResponses = await Promise.all(historyPromises);

        const historyByKidId = historyResponses.reduce(
          (acc, response, index) => {
            const kidId = kidsResponse.data.data[index].id;
            acc[kidId] = response.data.data;
            return acc;
          },
          {} as { [key: number]: GetQuestionsHistoryResponse[] }
        );

        setQuestionHistory(historyByKidId);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Subject colors mapping
  const subjectColors: Record<string, string> = {
    Math: "#0F4869",
    Science: "#2E8BC0",
    English: "#145F8B",
    History: "#f57c00",
    Geography: "#6a1b9a",
    Art: "#ec407a",
    Music: "#7b1fa2",
    Computer: "#0277bd",
  };

  const subjectData = Object.values(questionHistory)
    .flat()
    .reduce((acc, question) => {
      const existingSubject = acc.find((s) => s.name === question.subject);
      if (existingSubject) {
        existingSubject.value += 1;
      } else {
        // Use mapped color or default color if subject not in mapping
        const color = subjectColors[question.subject] || "#1976d2";
        acc.push({ name: question.subject, value: 1, color });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[]);

  // If no data, add placeholder data
  if (subjectData.length === 0) {
    subjectData.push(
      { name: "Math", value: 5, color: subjectColors["Math"] },
      { name: "Science", value: 3, color: subjectColors["Science"] },
      { name: "English", value: 4, color: subjectColors["English"] }
    );
  }

  const progressData = kids.map((kid) => {
    const history = questionHistory[kid.id] || [];
    const totalScore = history.reduce(
      (acc, q) => acc + (parseInt(q.answer) || 0),
      0
    );
    const averageScore = history.length > 0 ? totalScore / history.length : 0;
    return {
      month: new Date(kid.created_at).toLocaleString("default", {
        month: "short",
      }),
      score: averageScore,
    };
  });

  // Generate weekly data with random study hours for demonstration
  const weeklyData = [
    { day: "Mon", hours: Math.floor(Math.random() * 5) + 1 },
    { day: "Tue", hours: Math.floor(Math.random() * 5) + 1 },
    { day: "Wed", hours: Math.floor(Math.random() * 5) + 1 },
    { day: "Thu", hours: Math.floor(Math.random() * 5) + 1 },
    { day: "Fri", hours: Math.floor(Math.random() * 5) + 1 },
    { day: "Sat", hours: Math.floor(Math.random() * 3) },
    { day: "Sun", hours: Math.floor(Math.random() * 3) },
  ];

  const totalKids = kids.length;
  const avgQuizScore =
    progressData.length > 0
      ? Math.round(
          progressData.reduce((acc, p) => acc + p.score, 0) /
            progressData.length
        )
      : 0;
  const totalStudyHours = weeklyData.reduce((acc, w) => acc + w.hours, 0);

  // Calculate achievements based on question history or use placeholder
  const calculateAchievements = () => {
    const allHistory = Object.values(questionHistory).flat();
    if (allHistory.length > 0) {
      // Count achievements based on high scores (>80)
      return allHistory.filter((q) => parseInt(q.answer) > 80).length;
    }
    // Return placeholder value if no history
    return Math.floor(Math.random() * 5) + 3; // Random between 3-7
  };

  const totalAchievements = calculateAchievements();

  const statsCards = [
    {
      title: "Total Kids",
      value: totalKids,
      icon: <School />,
      color: "#1976d2",
      change: "",
    },
    {
      title: "Avg Quiz Score",
      value: `${avgQuizScore}%`,
      icon: <Quiz />,
      color: "#42a5f5",
      change: "",
    },
    {
      title: "Study Hours",
      value: `${totalStudyHours}h`,
      icon: <Timer />,
      color: "#8CD867 ",
      change: "",
    },
    {
      title: "Achievements",
      value: totalAchievements,
      icon: <EmojiEvents />,
      color: "#FABC3C",
      change: "",
    },
  ];

  // Sample subjects for random assignment
  const sampleSubjects = ["Math", "Science", "English", "History", "Geography"];

  const kidActivities = kids.map((kid) => {
    const history = questionHistory[kid.id] || [];
    const lastActivity = history[0];
    const kidProgress = progressData.find(
      (p) =>
        p.month ===
        new Date(kid.created_at).toLocaleString("default", { month: "short" })
    );

    // Generate random score between 60-100 if no real score available
    const randomScore = Math.floor(Math.random() * 41) + 60;

    // Generate random time within last 24 hours if no real time available
    const randomTime = () => {
      const now = new Date();
      const hoursAgo = Math.floor(Math.random() * 24);
      now.setHours(now.getHours() - hoursAgo);
      return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // Generate random subject if no real subject available
    const randomSubject =
      sampleSubjects[Math.floor(Math.random() * sampleSubjects.length)];

    return {
      name: kid.name,
      avatar: kid.name.charAt(0).toUpperCase(),
      subject: lastActivity?.subject || randomSubject,
      score: kidProgress?.score || randomScore,
      time: lastActivity
        ? new Date(lastActivity.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : randomTime(),
      achievement: lastActivity ? "Quiz Completed" : "Lesson Completed",
    };
  });

  // If no kids data, add placeholder kids
  if (kidActivities.length === 0) {
    kidActivities.push(
      {
        name: "Alex Johnson",
        avatar: "A",
        subject: "Math",
        score: 85,
        time: "10:30 AM",
        achievement: "Quiz Completed",
      },
      {
        name: "Emma Wilson",
        avatar: "E",
        subject: "Science",
        score: 92,
        time: "11:45 AM",
        achievement: "Lesson Completed",
      }
    );
  }

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading dashboard data...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography
              fontSize={"24px"}
              sx={{ color: "#002979" }}
              fontWeight={600}
            >
              Welcome back, {user?.name || "Parent"}! 👋
            </Typography>
            <Typography fontSize={"16px"} fontWeight={400} color="textDisabled">
              Here's what's happening with your kids' learning journey
            </Typography>
          </Box>
          {/* <VirtualCharacter
            size="lg"
            animation="celebrating"
            message="Your kids are doing amazing!"
          /> */}
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={4} mb={4}>
        {statsCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        backgroundColor: stat.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <TrendingUp sx={{ color: "success.main" }} />
                  </Box>
                  <Typography variant="h4" fontWeight={700}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    {stat.title}
                  </Typography>
                  {stat.change && (
                    <Chip
                      label={stat.change}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      {/* Charts Section */}
      <Grid container spacing={4} mb={4}>
        {/* Subject Distribution */}
        <Grid size={{ xs: 12, md: 4 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent>
                <Typography
                  fontSize={"18px"}
                  sx={{ color: "#002979" }}
                  fontWeight={500}
                  mb={3}
                >
                  Subject Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={subjectData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={85}
                      dataKey="value"
                    >
                      {subjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  {subjectData.map((item) => (
                    <Box
                      key={item.name}
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          backgroundColor: item.color,
                        }}
                      />
                      <Typography variant="caption">{item.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Learning Progress */}
        <Grid size={{ xs: 12, md: 8 }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent>
                <Typography
                  fontSize={"18px"}
                  sx={{ color: "#002979" }}
                  fontWeight={500}
                  mb={3}
                >
                  Learning Progress
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={progressData}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#1976d2"
                      strokeWidth={3}
                      dot={{ fill: "#1976d2", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Weekly Study Hours & Recent Activities */}
      <Grid container spacing={4}>
        {/* Weekly Study Hours */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card elevation={3}>
              <CardContent>
                <Typography
                  fontSize={"18px"}
                  fontWeight={500}
                  sx={{ color: "#002979" }}
                  mb={3}
                >
                  This Week's Study Hours
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Bar dataKey="hours" fill="#0F4869" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Activities */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent>
                <Typography
                  fontSize={"18px"}
                  sx={{ color: "#002979" }}
                  fontWeight={500}
                  mb={3}
                >
                  Recent Kid Activities
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {kidActivities.map((activity, index) => (
                    <motion.div
                      key={activity.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "action.hover",
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              bgcolor: "#002979",
                              width: 40,
                              height: 40,
                            }}
                          >
                            {activity.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {activity.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {activity.subject} • {activity.time}
                            </Typography>
                          </Box>
                        </Box>
                        <Box textAlign="right">
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                          >
                            <Star
                              sx={{ color: "warning.main", fontSize: 16 }}
                            />
                            <Typography variant="body2" fontWeight="bold">
                              {activity.score}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={activity.score}
                            sx={{ width: 60, borderRadius: 2 }}
                          />
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

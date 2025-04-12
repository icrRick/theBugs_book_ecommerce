"use client";

import { useState, useRef, useEffect } from "react";
import {
      Camera,
      X,
      Video,
      CheckCircle,
      RotateCcw,
      RefreshCw,
      Maximize2,
      Play,
      Pause,
} from "lucide-react";
import { showErrorToast } from "../../utils/Toast";

const VideoCapture = ({ onClose, onVideoCaptured }) => {
      const [isRecording, setIsRecording] = useState(false);
      const [countdown, setCountdown] = useState(3);
      const [isCountingDown, setIsCountingDown] = useState(false);
      const [recordTimeLeft, setRecordTimeLeft] = useState(5);
      const [instruction, setInstruction] = useState("");
      const [step, setStep] = useState(0); // 0: initial, 1: left, 2: right
      const [isReviewing, setIsReviewing] = useState(false);
      const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
      const [recordedVideoFile, setRecordedVideoFile] = useState(null);
      const [isPlaying, setIsPlaying] = useState(false);

      const videoRef = useRef(null);
      const reviewVideoRef = useRef(null);
      const mediaRecorderRef = useRef(null);
      const videoStreamRef = useRef(null);
      const timerRef = useRef(null);

      useEffect(() => {
            return () => {
                  if (videoStreamRef.current) {
                        videoStreamRef.current
                              .getTracks()
                              .forEach((track) => track.stop());
                  }
                  clearInterval(timerRef.current);

                  // Clean up any object URLs we created
                  if (recordedVideoUrl) {
                        URL.revokeObjectURL(recordedVideoUrl);
                  }
            };
      }, [recordedVideoUrl]);

      // Monitor video play state
      useEffect(() => {
            if (reviewVideoRef.current) {
                  const videoElement = reviewVideoRef.current;

                  const handlePlay = () => setIsPlaying(true);
                  const handlePause = () => setIsPlaying(false);
                  const handleEnded = () => setIsPlaying(false);

                  videoElement.addEventListener("play", handlePlay);
                  videoElement.addEventListener("pause", handlePause);
                  videoElement.addEventListener("ended", handleEnded);

                  return () => {
                        videoElement.removeEventListener("play", handlePlay);
                        videoElement.removeEventListener("pause", handlePause);
                        videoElement.removeEventListener("ended", handleEnded);
                  };
            }
      }, [isReviewing]);

      const startRecording = async () => {
            try {
                  // If we were reviewing, clean up the previous recording
                  if (isReviewing) {
                        setIsReviewing(false);
                        if (recordedVideoUrl) {
                              URL.revokeObjectURL(recordedVideoUrl);
                              setRecordedVideoUrl(null);
                        }
                  }

                  const stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                  });
                  videoStreamRef.current = stream;
                  videoRef.current.srcObject = stream;

                  setIsCountingDown(true);
                  setCountdown(3);
                  let timer = 3;

                  const countdownInterval = setInterval(() => {
                        timer--;
                        setCountdown(timer);
                        if (timer <= 0) {
                              clearInterval(countdownInterval);
                              recordVideo(stream);
                        }
                  }, 1000);
            } catch (err) {
                  console.error("Không thể truy cập camera:", err);
            }
      };

      const recordVideo = (stream) => {
            try {
                  const chunks = [];
                  if (!stream) throw new Error("Không có stream video.");

                  mediaRecorderRef.current = new MediaRecorder(stream);

                  mediaRecorderRef.current.ondataavailable = (event) => {
                        if (event.data && event.data.size > 0) {
                              chunks.push(event.data);
                        }
                  };

                  mediaRecorderRef.current.onstop = () => {
                        const videoBlob = new Blob(chunks, {
                              type: "video/mp4",
                        });
                        const videoFile = new File([videoBlob], "video.mp4", {
                              type: "video/mp4",
                        });

                        const videoUrl = URL.createObjectURL(videoBlob);
                        setRecordedVideoUrl(videoUrl);
                        setRecordedVideoFile(videoFile);
                        setIsReviewing(true);

                        if (videoStreamRef.current) {
                              videoStreamRef.current
                                    .getTracks()
                                    .forEach((track) => track.stop());
                        }
                  };

                  mediaRecorderRef.current.start();
                  setIsRecording(true);
                  setIsCountingDown(false);
                  setRecordTimeLeft(6);
                  setStep(1);
                  setInstruction("Hướng dẫn: Quay đầu sang trái");

                  timerRef.current = setInterval(() => {
                        setRecordTimeLeft((prev) => {
                              if (prev <= 1) {
                                    clearInterval(timerRef.current);
                                    stopRecording();
                                    return 0;
                              }
                              return prev - 1;
                        });
                  }, 1000);

                  setTimeout(() => {
                        setInstruction("Hướng dẫn: Quay đầu sang phải");
                        setStep(2);
                  }, 2000);

                  setTimeout(() => {
                        stopRecording();
                  }, 6000);
            } catch (error) {
                  console.error("Lỗi khi bắt đầu quay video:", error);
                  showErrorToast(
                        "Không thể quay video. Vui lòng kiểm tra lại quyền camera."
                  );
                  // Reset UI state để không bị treo
                  setIsRecording(false);
                  setIsCountingDown(false);
                  setRecordTimeLeft(0);
                  setStep(0);
                  setInstruction("");
            }
      };

      const stopRecording = () => {
            if (mediaRecorderRef.current) {
                  mediaRecorderRef.current.stop();
                  setIsRecording(false);
            }
      };

      const confirmVideo = () => {
            if (recordedVideoFile) {
                  onVideoCaptured(recordedVideoFile);
            }
      };

      const reRecord = () => {
            setIsReviewing(false);
            if (recordedVideoUrl) {
                  URL.revokeObjectURL(recordedVideoUrl);
                  setRecordedVideoUrl(null);
                  setRecordedVideoFile(null);
            }
            startRecording();
      };

      const replayVideo = () => {
            if (reviewVideoRef.current) {
                  reviewVideoRef.current.currentTime = 0;
                  reviewVideoRef.current.play();
            }
      };

      const togglePlayPause = () => {
            if (reviewVideoRef.current) {
                  if (isPlaying) {
                        reviewVideoRef.current.pause();
                  } else {
                        reviewVideoRef.current.play();
                  }
            }
      };

      const toggleFullscreen = () => {
            if (reviewVideoRef.current) {
                  if (document.fullscreenElement) {
                        document.exitFullscreen();
                  } else {
                        reviewVideoRef.current.requestFullscreen();
                  }
            }
      };

      return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 !mt-0">
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-[90%] max-w-[1100px] p-6 sm:p-10 relative">
                        <div className="absolute top-4 right-4">
                              <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 transition rounded-full p-2 hover:bg-gray-100"
                              >
                                    <X className="w-5 h-5" />
                              </button>
                        </div>

                        <div className="flex items-center justify-center mb-6">
                              <Camera className="text-emerald-500 w-7 h-7 mr-3" />
                              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                                    Xác minh khuôn mặt
                              </h2>
                        </div>

                        <p className="text-sm text-center text-gray-500 mb-6 max-w-lg mx-auto">
                              {isReviewing
                                    ? "Vui lòng xem lại video của bạn. Nếu hài lòng, hãy nhấn Xác nhận để tiếp tục."
                                    : "Vui lòng nhìn vào camera và làm theo hướng dẫn. Video sẽ được quay trong 5 giây."}
                        </p>

                        <div className="flex justify-center mb-6">
                              <div className="relative w-full max-w-[1100px] aspect-video bg-gray-100 rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                    {/* Video review mode */}
                                    {isReviewing ? (
                                          <>
                                                <video
                                                      ref={reviewVideoRef}
                                                      src={recordedVideoUrl}
                                                      className="absolute top-0 left-0 w-full h-full object-cover"
                                                      controls={false}
                                                      autoPlay
                                                />
                                                {/* Custom video controls overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                      <div className="flex items-center justify-between text-white mb-2">
                                                            <div className="flex items-center gap-2">
                                                                  <button
                                                                        onClick={
                                                                              togglePlayPause
                                                                        }
                                                                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
                                                                  >
                                                                        {isPlaying ? (
                                                                              <Pause className="w-5 h-5" />
                                                                        ) : (
                                                                              <Play className="w-5 h-5" />
                                                                        )}
                                                                  </button>
                                                                  <button
                                                                        onClick={
                                                                              replayVideo
                                                                        }
                                                                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
                                                                        title="Xem lại từ đầu"
                                                                  >
                                                                        <RefreshCw className="w-5 h-5" />
                                                                  </button>
                                                            </div>
                                                            <button
                                                                  onClick={
                                                                        toggleFullscreen
                                                                  }
                                                                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
                                                            >
                                                                  <Maximize2 className="w-5 h-5" />
                                                            </button>
                                                      </div>
                                                </div>
                                                {/* Overlay message */}
                                                <div className="absolute top-4 left-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full z-10">
                                                      Đang xem lại video
                                                </div>
                                          </>
                                    ) : (
                                          /* Camera mode */
                                          <video
                                                ref={videoRef}
                                                autoPlay
                                                muted
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                          />
                                    )}

                                    {/* Countdown trước khi quay */}
                                    {isCountingDown && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white z-10">
                                                <div className="flex flex-col items-center">
                                                      <span className="text-7xl font-bold animate-pulse">
                                                            {countdown}
                                                      </span>
                                                      <span className="mt-2 text-lg">
                                                            Chuẩn bị...
                                                      </span>
                                                </div>
                                          </div>
                                    )}

                                    {/* Đang quay: hiển thị đồng hồ đếm ngược và hướng dẫn */}
                                    {isRecording && (
                                          <>
                                                <div className="absolute top-0 left-0 w-full h-full border-4 border-red-500 animate-pulse z-10 pointer-events-none"></div>

                                                <div className="absolute top-4 right-4 bg-red-600 text-white text-sm px-3 py-1 rounded-full z-20 flex items-center">
                                                      <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                                                      Đang quay:{" "}
                                                      {recordTimeLeft}s
                                                </div>

                                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white rounded-xl text-lg font-medium px-6 py-3 z-20 flex items-center">
                                                      <div className="mr-3">
                                                            {step === 1 ? (
                                                                  <svg
                                                                        className="w-6 h-6"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                  >
                                                                        <path
                                                                              d="M19 12H5M5 12L12 19M5 12L12 5"
                                                                              stroke="currentColor"
                                                                              strokeWidth="2"
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                        />
                                                                  </svg>
                                                            ) : (
                                                                  <svg
                                                                        className="w-6 h-6"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                  >
                                                                        <path
                                                                              d="M5 12H19M19 12L12 5M19 12L12 19"
                                                                              stroke="currentColor"
                                                                              strokeWidth="2"
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                        />
                                                                  </svg>
                                                            )}
                                                      </div>
                                                      {instruction}
                                                </div>

                                                {/* Progress bar */}
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300 z-20">
                                                      <div
                                                            className="h-full bg-emerald-500 transition-all duration-1000"
                                                            style={{
                                                                  width: `${
                                                                        (recordTimeLeft /
                                                                              5) *
                                                                        100
                                                                  }%`,
                                                            }}
                                                      ></div>
                                                </div>
                                          </>
                                    )}

                                    {/* Khi chưa bắt đầu quay và không đang xem lại */}
                                    {!isRecording &&
                                          !isCountingDown &&
                                          !isReviewing && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white z-10">
                                                      <div className="flex flex-col items-center">
                                                            <Video className="w-16 h-16 mb-4 opacity-80" />
                                                            <span className="text-lg">
                                                                  Nhấn nút bên
                                                                  dưới để bắt
                                                                  đầu
                                                            </span>
                                                      </div>
                                                </div>
                                          )}
                              </div>
                        </div>

                        {/* Review controls */}
                        {isReviewing && (
                              <div className="flex justify-center mb-4">
                                    <button
                                          onClick={replayVideo}
                                          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition"
                                    >
                                          <RefreshCw className="w-4 h-4" />
                                          Xem lại video
                                    </button>
                              </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                              {isReviewing ? (
                                    <>
                                          <button
                                                onClick={confirmVideo}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-base sm:text-lg shadow-lg transition flex items-center"
                                          >
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Xác nhận
                                          </button>
                                          <button
                                                onClick={reRecord}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-full text-base sm:text-lg shadow transition flex items-center"
                                          >
                                                <RotateCcw className="w-5 h-5 mr-2" />
                                                Quay lại
                                          </button>
                                    </>
                              ) : !isRecording && !isCountingDown ? (
                                    <button
                                          onClick={startRecording}
                                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-base sm:text-lg shadow-lg transition flex items-center"
                                    >
                                          <Camera className="w-5 h-5 mr-2" />
                                          Bắt đầu quay video
                                    </button>
                              ) : (
                                    isRecording && (
                                          <button
                                                onClick={stopRecording}
                                                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-base sm:text-lg shadow-lg transition flex items-center"
                                          >
                                                <X className="w-5 h-5 mr-2" />
                                                Dừng quay video
                                          </button>
                                    )
                              )}

                              {!isRecording &&
                                    !isCountingDown &&
                                    !isReviewing && (
                                          <button
                                                onClick={onClose}
                                                className="text-gray-500 hover:text-gray-700 transition text-sm sm:text-base underline"
                                          >
                                                Đóng cửa sổ
                                          </button>
                                    )}
                        </div>

                        <div className="mt-6 text-xs text-center text-gray-400 max-w-md mx-auto">
                              <p>
                                    Video này chỉ được sử dụng để xác minh danh
                                    tính và sẽ không được lưu trữ sau khi quá
                                    trình xác minh hoàn tất.
                              </p>
                        </div>
                  </div>
            </div>
      );
};

export default VideoCapture;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const PaymentStatus = () => {
    const [countDown, setCountDown] = useState(5);
    const [message, setMessage] = useState([]);
    const [responseCode, setResponseCode] = useState();
    const [orderId, setOrderId] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (countDown === 0) {
            navigate("/home");
        } else {
            const intervalId = setInterval(() => {
                setCountDown((prevCountDown) => {
                    if (prevCountDown > 0) {
                        return prevCountDown - 1;
                    } else {
                        clearInterval(intervalId);
                        return 0;
                    }
                });
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [countDown, navigate]);
    function getParamsFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        setResponseCode(urlParams.get("vnp_ResponseCode"));
        setOrderId(urlParams.get("vnp_TxnRef"));
        console.log("ResponseCode: " + responseCode);
    }

    const sendData = async (data) => {
        const paymentRes = await axios.get(
            "http://localhost:8080/payment-online/return-payment",
            {
                params: { vnp_ResponseCode: responseCode, vnp_TxnRef: orderId },
            }
        );
        setMessage(paymentRes.data.data);
    };
    useEffect(() => {
        getParamsFromUrl();
    }, []);
    useEffect(() => {
        if (responseCode) {
            sendData();
        }
    }, [responseCode]);
    return (
        <>
            {/* Error section */}
            <section className="error_area">
                <div className="container">
                    <div className="error_inner">
                        <div className="error_inner_text">
                            <h5>{message}</h5>
                            <h6>
                                Bạn sẽ được chuyển về trang chủ sau {countDown}
                                giây
                            </h6>
                            <Link
                                to={"/home"}
                                className="pink_btn text-decoration-none"
                            >
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PaymentStatus;
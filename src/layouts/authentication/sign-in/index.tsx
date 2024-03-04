import { useState } from "react";
import { toast } from "react-toastify";

import { Link, useNavigate } from "react-router-dom";

import { Grid, InputAdornment, Divider, Paper } from "@mui/material";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDCircularLoader from "components/MDCircularLoader";
import { Theme } from "@mui/material/styles";

import PageLayout from "examples/LayoutContainers/PageLayout";
import { MuiOtpInput } from "mui-one-time-password-input";

// Image
import bgImage from "assets/images/loginBg.png";
import loginLogo from "assets/images/loginLogo.png";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import { ISignupVars, SIGNUP } from "graphql/mutations/signup";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ILoginVars, LOGIN } from "graphql/mutations/login";
import { GET_AUTH_STATUS, IGetAuthStatusVars, IGetAuthStatus } from "graphql/queries/getAuthStatus";
import { LOGIN_VIA_OTP, ILoginOtpVars } from "graphql/mutations/loginViaOtp";
import { VERIFY_OTP, IVerifyOtpVars } from "graphql/mutations/verifyOtp";
import { RESET_PASSWORD, IResetPasswordVars } from "graphql/mutations/resetPassword";

import { validateEmail } from "../utils";

function SignIn(): JSX.Element {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSignup, setIsSignUp] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showOtp, setShowOtp] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [forgotPsw, setForgotPsw] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");

  const [signupMutation] = useMutation<ISignupVars>(SIGNUP);
  const [loginMutation] = useMutation<ILoginVars>(LOGIN);
  const [verifyOtp] = useMutation<IVerifyOtpVars>(VERIFY_OTP);
  const [resetPassword] = useMutation<IResetPasswordVars>(RESET_PASSWORD);

  const [getAuthStatus] = useLazyQuery<IGetAuthStatusVars>(GET_AUTH_STATUS);
  const [loginViaOtp] = useMutation<ILoginOtpVars>(LOGIN_VIA_OTP);

  const handleEmailSubmit = async () => {
    setLoading(true);
    if (email) {
      const isEmailValid = validateEmail(email);
      if (isEmailValid) {
        setEmailError("");
        getAuthStatus({
          variables: {
            email,
          },
        })
          .then(async (res: any) => {
            const status = res.data.getAuthStatus.status;
            if (status === "NOT_FOUND") {
              setIsSignUp(true);
            } else if (status === "EMAIL_NOT_VERIFIED") {
              toast.error("Email not verified, please verified it.");
              await handleForgotPassword(true);
            } else {
              setShowPassword(true);
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error("There was an error fetching email data:", err);
          });
      } else {
        setEmailError("Invalid Email Address");
      }
    } else {
      setEmailError("Invalid Email Address");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (resetPsw = false) => {
    setLoading(true);
    loginViaOtp({
      variables: {
        email,
      },
    })
      .then((res: any) => {
        setShowOtp(res.data.loginViaOtp.token);
        setIsSignUp(false);
        if (resetPsw) setForgotPsw(res.data.loginViaOtp.token);
        else setForgotPsw("");
        setShowPassword(false);
        setLoading(false);
      })
      .catch((e: any) => {
        setLoading(false);
        toast.error(e?.message);
      });
  };

  const handleLogin = async () => {
    if (password) {
      try {
        setLoading(true);
        loginMutation({
          variables: {
            password,
            email,
          },
        })
          .then((res: any) => {
            if (res.data) {
              localStorage.setItem("token", res.data.login.token);
              toast.success("Login Successful!!");
              navigate("/");
            }
          })
          .catch((err) => {
            setLoading(false);
            toast.error(err.message || "An error occurred during login");
          });
      } catch (error: any) {
        setLoading(false);
        toast.error(error);
      }
    }
  };

  const handleSignup = async () => {
    if (fullName && password) {
      setLoading(true);
      signupMutation({
        variables: { email, fullName, password },
      })
        .then((res: any) => {
          if (res?.data?.signup?.token) {
            setShowOtp(res?.data?.signup?.token);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err?.response?.data?.message || "Error fetching email data");
        });
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      toast.error("Invalid Otp");
      return;
    }
    setLoading(true);
    verifyOtp({
      variables: {
        params: {
          token: showOtp,
          otp,
        },
      },
    })
      .then((res: any) => {
        if (!forgotPsw) {
          localStorage.setItem("token", res.data.verifyOtp.token);
          toast.success("Login Successful!!");
          navigate("/");
        } else {
          setForgotPsw(res.data.verifyOtp.token);
          setShowOtp("");
        }
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        setOtp("");
        toast.error(err?.message || "Invalid OTP");
      });
  };

  const handleResetPassword = async () => {
    setLoading(true);
    resetPassword({
      variables: {
        password,
      },
      context: {
        headers: {
          Authorization: `Bearer ${forgotPsw}`,
        },
      },
    })
      .then(() => {
        localStorage.setItem("token", forgotPsw);
        toast.success("Password reset succesfully");
        navigate("/");
      })
      .catch((e: any) => {
        setLoading(false);
        toast.error(e?.message);
      });
  };

  return (
    <PageLayout background="white">
      <MDBox
        width="100vw"
        height={"100vh"}
        m="auto"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundImage: ({
            functions: { linearGradient, rgba },
            palette: { gradients },
          }: Theme) =>
            bgImage &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.4),
              rgba(gradients.dark.state, 0.4)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {loading && <MDCircularLoader overlayloader startLoader />}
        <MDBox width="100%" px={1} m="auto">
          <Grid container spacing={1} justifyContent="center" alignItems="center">
            <Grid item xs={11} sm={9} md={5} lg={5} xl={5} alignItems="center">
              <Paper
                sx={{
                  mx: "auto",
                  height: isSignup || showPassword ? "80vh" : "70vh",
                  overflow: "scroll",
                }}
              >
                <MDBox
                  p={2}
                  py={4}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="space-between"
                  height="100%"
                >
                  <MDBox display="flex" flexDirection="column" alignItems="center">
                    <MDBox
                      width="172px"
                      height="86px"
                      sx={{
                        backgroundImage: `url(${loginLogo})`,
                        backgroundSize: "cover",
                      }}
                    />
                    <Divider sx={{ width: "100%", mt: 4, mb: 2, px: 0 }} />
                    <MDBox px={1} textAlign="center">
                      <MDBox textAlign="center">
                        <MDTypography fontSize="42px" fontWeight="medium">
                          {showOtp
                            ? "Confirmation Awaits!"
                            : forgotPsw
                            ? "Secure Access"
                            : "Welcome to OneWire!"}
                        </MDTypography>
                      </MDBox>
                      <MDTypography fontSize="16px" color="text" fontWeight="regular">
                        {showOtp
                          ? "We've sent a One-Time Password(OTP) to your email. Please enter it below to verify your account."
                          : isSignup
                          ? "Lets get started!"
                          : forgotPsw
                          ? "Now! Please enter your new password to unlock your Account."
                          : "Let's get you connected. Please enter your work email to begin."}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox px={1} pt={3} width="100%">
                    <MDBox component="form" role="form">
                      {!(showOtp || forgotPsw) && (
                        <>
                          <MDTypography fontSize="16px" fontWeight="medium" color="textSecondary">
                            Work Email
                          </MDTypography>
                          <MDBox mb={2}>
                            <MDInput
                              type="email"
                              fullWidth
                              error={emailError !== ""}
                              value={email}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e: any) => setEmail(e.target.value)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">
                                    <EmailOutlinedIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </MDBox>
                          {isSignup && (
                            <MDBox mb={2}>
                              <MDTypography
                                fontSize="16px"
                                fontWeight="medium"
                                color="textSecondary"
                              >
                                Name
                              </MDTypography>
                              <MDInput
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                value={fullName}
                                onChange={(e: any) => setFullName(e.target.value)}
                                fullWidth
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="start">
                                      <PersonOutlineIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </MDBox>
                          )}
                          {(isSignup || showPassword) && (
                            <MDBox mb={2}>
                              <MDTypography
                                fontSize="16px"
                                fontWeight="medium"
                                color="textSecondary"
                              >
                                Password
                              </MDTypography>
                              <MDInput
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                                type="password"
                                fullWidth
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="start">
                                      <LockOutlinedIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </MDBox>
                          )}
                        </>
                      )}
                      {!showOtp && forgotPsw && (
                        <MDBox mb={2}>
                          <MDTypography fontSize="16px" fontWeight="medium" color="textSecondary">
                            Password
                          </MDTypography>
                          <MDInput
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                            type="password"
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  <LockOutlinedIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </MDBox>
                      )}
                      {showOtp && (
                        <MDBox mb={2}>
                          <MDTypography fontSize="16px" fontWeight="medium" color="textSecondary">
                            Enter OTP
                          </MDTypography>
                          <MDBox display="flex" justifyContent="center">
                            <MuiOtpInput
                              value={otp}
                              onChange={(val) => setOtp(val)}
                              length={4}
                              autoFocus
                              validateChar={(character: string, index: number) => true}
                              sx={{
                                "& .MuiOtpInput-TextField input": {
                                  width: "36px",
                                  height: "36px",
                                  bgcolor: "#fff",
                                  padding: "4px",
                                  borderRadius: "8px",
                                },
                              }}
                            />
                          </MDBox>
                        </MDBox>
                      )}

                      <MDBox mt={2}>
                        <MDButton
                          onClick={() => {
                            if (isSignup) handleSignup();
                            else if (showPassword) handleLogin();
                            else if (showOtp) handleVerifyOtp();
                            else if (!showOtp && forgotPsw) handleResetPassword();
                            else handleEmailSubmit();
                          }}
                          color="secondary"
                          size="large"
                          fullWidth
                        >
                          {showOtp || showPassword || forgotPsw ? "Submit" : " Next"}
                        </MDButton>
                      </MDBox>
                      {(showPassword || showOtp) && (
                        <MDBox mt={1} textAlign="left">
                          <MDTypography variant="button" color="text">
                            {showOtp ? "" : showPassword ? "" : "Don't have an account?"}
                            <MDTypography
                              component={Link}
                              onClick={() => {
                                if (showPassword || showOtp) handleForgotPassword(true);
                              }}
                              variant="button"
                              color="secondary"
                              fontWeight="medium"
                              textGradient
                              sx={{ ml: 1 }}
                            >
                              {showOtp
                                ? "Resend OTP?"
                                : showPassword
                                ? "Forgot Password?"
                                : "Signup"}
                            </MDTypography>
                          </MDTypography>
                        </MDBox>
                      )}
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Paper>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </PageLayout>
  );
}

export default SignIn;

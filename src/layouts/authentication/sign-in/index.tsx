import { useState } from "react";
import { toast } from "react-toastify";

import { Link, useNavigate } from "react-router-dom";

import { Grid, InputAdornment } from "@mui/material";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDCircularLoader from "components/MDCircularLoader";
import { useMaterialUIController } from "context";
import PageLayout from "examples/LayoutContainers/PageLayout";
import { MuiOtpInput } from "mui-one-time-password-input";

// Image
import OneWireLogo from "assets/images/OneWireLogo_2.svg";
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
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

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
              const roleVal = res?.data?.login?.type;
              localStorage.setItem("token", res.data.login.token);
              localStorage.setItem("role", roleVal);
              const routeVal = roleVal === "ADMIN" ? "/orders" : "/";
              toast.success("Login Successful!!");
              navigate(routeVal);
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
    } else {
      toast.error(`Please enter the ${!fullName ? "name" : "password"}`);
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

  const handleSubmit = () => {
    if (isSignup) handleSignup();
    else if (showPassword) handleLogin();
    else if (showOtp) handleVerifyOtp();
    else if (!showOtp && forgotPsw) handleResetPassword();
    else handleEmailSubmit();
  };

  const onKeyDownHandler = (e: any) => {
    if (e?.keyCode === 13) {
      e?.target?.blur();
      e?.preventDefault();
      handleSubmit();
    }
  };

  return (
    <PageLayout>
      <Grid
        container
        // sx={{
        //   backgroundColor: ({ palette: { background, white } }) =>
        //     darkMode ? background.default : white.main,
        // }}
      >
        {loading && <MDCircularLoader overlayloader startLoader />}
        <Grid item xs={12} lg={6}>
          <MDBox
            display={{ xs: "none", lg: "flex" }}
            alignItems="center"
            justifyContent="space-between"
            width="calc(100% - 2rem)"
            height="calc(100vh - 2rem)"
            borderRadius="lg"
            ml={2}
            mt={2}
          >
            {/* <img src={OneWireLogo} height="198px" width="371px" alt="logo" /> */}
            <MDBox
              display={{ xs: "none", lg: "flex" }}
              alignItems="center"
              justifyContent="center"
              width="calc(80% - 2rem)"
              height="calc(100vh - 2rem)"
              sx={{
                background: "#FFFFFF",
                borderTopLeftRadius: "16px",
                borderBottomLeftRadius: "16px",
              }}
            >
              {/* <img src={OneWireLogo} height="198px" width="371px" alt="logo" /> */}
            </MDBox>
            <MDBox
              display={{ xs: "none", lg: "flex" }}
              alignItems="center"
              justifyContent="center"
              width="calc(100% - 2rem)"
              height="calc(100vh - 2rem)"
              sx={{
                background: "#313235",
                borderTopRightRadius: "16px",
                borderBottomRightRadius: "16px",
              }}
            >
              {/* <img src={OneWireLogo} height="198px" width="371px" alt="logo" /> */}
            </MDBox>
          </MDBox>
          <Grid
            item
            xs={12}
            lg={12}
            sx={{
              position: "absolute",
              top: "50%",
              left: "25%",
              transform: "translate(-50%, -50%)",
            }}
          >
              <img src={OneWireLogo} height="198px" width="295px" alt="logo" />
          </Grid>
        </Grid>
        <Grid item xs={11} sm={8} md={6} lg={4} xl={3} sx={{ mx: "auto" }}>
          <MDBox display="flex" flexDirection="column" justifyContent="center" height="100vh">
            <MDBox py={3} px={3} textAlign="center">
              <>
                <MDBox mb={1} textAlign="center">
                  <MDTypography variant="h4" fontWeight="bold">
                    {showOtp
                      ? "Confirmation Awaits!"
                      : forgotPsw
                      ? "Secure Access"
                      : "Welcome to OneWire!"}
                  </MDTypography>
                </MDBox>

                <MDTypography variant="body2" color="text" fontWeight="regular">
                  {showOtp
                    ? "We've sent a One-Time Password(OTP) to your email. Please enter it below to verify your account."
                    : isSignup
                    ? "Lets get started!"
                    : forgotPsw
                    ? "Now! Please enter your new password to unlock your Account."
                    : "Let's get you connected. Please enter your work email to begin."}
                </MDTypography>
              </>
            </MDBox>
            <MDBox p={3}>
              <MDBox component="form" role="form" onKeyDown={onKeyDownHandler}>
                {!(showOtp || forgotPsw) && (
                  <>
                    <MDTypography
                      sx={{ mb: "0.5rem" }}
                      fontSize="16px"
                      fontWeight="medium"
                      color="textSecondary"
                    >
                      Work Email
                    </MDTypography>
                    <MDBox mb={2}>
                      <MDInput
                        type="email"
                        fullWidth
                        disabled={isSignup || showPassword}
                        error={emailError !== ""}
                        value={email}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e: any) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
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
                          sx={{ mb: "0.5rem" }}
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
                          sx={{ mb: "0.5rem" }}
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
                    <MDTypography
                      sx={{ mb: "0.5rem" }}
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
                {showOtp && (
                  <MDBox mb={2}>
                    <MDTypography
                      sx={{ mb: "0.5rem" }}
                      fontSize="16px"
                      fontWeight="medium"
                      color="textSecondary"
                    >
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

                <MDBox mt={4}>
                  <MDButton onClick={handleSubmit} color="secondary" size="large" fullWidth>
                    {showOtp || showPassword || forgotPsw ? "Submit" : " Next"}
                  </MDButton>
                </MDBox>
                {(showPassword || showOtp) && (
                  <MDBox mt={1} textAlign="left">
                    <MDTypography variant="button" color="secondary">
                      {showOtp ? "" : showPassword ? "" : "Don't have an account?"}
                      <MDTypography
                        component={Link}
                        onClick={() => {
                          if (showPassword || showOtp) handleForgotPassword(true);
                        }}
                        variant="button"
                        color="primary"
                        fontWeight="medium"
                        textGradient
                        sx={{ ml: 1 }}
                      >
                        {showOtp ? "Resend OTP?" : showPassword ? "Forgot Password?" : "Signup"}
                      </MDTypography>
                    </MDTypography>
                  </MDBox>
                )}
              </MDBox>
            </MDBox>
          </MDBox>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export default SignIn;

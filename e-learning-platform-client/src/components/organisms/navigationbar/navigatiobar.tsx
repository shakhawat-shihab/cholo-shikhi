import React, { useEffect } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Badge,
} from "@material-tailwind/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileMenu from "./profileMenu";
import Icon from "../../atoms/icon/icon";
import {
  Bars4Icon,
  BellAlertIcon,
  BellIcon,
  BellSnoozeIcon,
  GlobeAsiaAustraliaIcon,
  HeartIcon,
  HomeIcon,
  ShoppingCartIcon,
  ViewfinderCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { showDashboardDrawer } from "../../../redux/slices/settingsSlice";
import "./navigatiobar.scss";
import useSubscriptionHook from "../../../hooks/subscription/useSubscriptionHook";
import useCourseHook from "../../../hooks/course/useCourseHook";
import { NotificationPopover } from "../notificationPopover/notificationPopover";
import useNotificationHook from "../../../hooks/notification/useNotificationHook";
import useCartHook from "../../../hooks/cart/useCartHook";
import useWishlistHook from "../../../hooks/wishlist/useWishlistHook";

export default function Navigationbar() {
  const [openNav, setOpenNav] = React.useState(false);
  const [reloadNotification, setReloadNotification] = React.useState(false);
  // const [isDashboard, setIsDashboard] = React.useState(false);
  const location = useLocation();
  const { auth, settings, cart, wishlist } = useSelector((state: any) => state);
  const user = auth?.userData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("user.role ", user?.role);
  // console.log("settings ", settings);

  useEffect(() => {
    // console.log("window.innerWidth ", window.innerWidth);
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 768 && setOpenNav(false)
    );
  }, []);

  const {
    loadAdminNotifications,
    loadNotificationByUser,
    adminNotification,
    notification,
  } = useNotificationHook();
  const { loadCart } = useCartHook();
  const { loadWishlist } = useWishlistHook();

  React.useEffect(() => {
    if (user?.role == "student") {
      loadCart(user?.userRef?.studentRef);
      loadWishlist(user?.userRef?.studentRef);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role == "pending") {
      navigate("/pending/dashboard");
    }
  }, [user]);

  const { loadSubscription } = useSubscriptionHook();
  const { loadTeacherCourses } = useCourseHook();
  useEffect(() => {
    if (user?.role == "teacher") loadTeacherCourses(user?.userRef?.teacherRef);
    if (user?.role == "admin") {
      loadSubscription({});
    }
  }, [user]);

  useEffect(() => {
    // console.log("reload notificationnnnnnnnnnnnnnnn");
    if (
      user?.role == "student" ||
      user?.role == "teacher" ||
      user?.role == "pending"
    ) {
      // console.log(user?.userRef?._id);
      loadNotificationByUser(user?.userRef?._id);
    } else if (user?.role == "admin") {
      loadAdminNotifications();
    }
  }, [reloadNotification]);

  // console.log("location ", location);

  return (
    <Navbar
      // className="md:absolute md:top-8 md:left-1/2 md:-translate-x-1/2   mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4 z-10 "
      className={` bg-transparent
      relative top-0  min-w-full 
      mx-auto  px-1 sm:px-4 sm:py-2 lg:px-8 lg:py-4 z-10 rounded-none`}
      shadow={false}
    >
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        {/* logo and drawer icon */}
        <div className="flex items-center">
          {/* in sm screen the dashboard is not visible */}
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => dispatch(showDashboardDrawer())}
          >
            <Icon iconName={Bars4Icon} className="w-6 h-6" />
          </IconButton>

          <Link to="/home" className="hidden  sm:block">
            <Typography
              as="h2"
              className="mr-4 cursor-pointer py-1.5  ms-4 text-2xl font-bold"
              // id="logo"
            >
              Cholo Shikhi
            </Typography>
          </Link>
        </div>

        <div className="hidden md:block">
          {/* {navList} */}
          <ul className="mt-2 mb-4 flex flex-col gap-2 md:mb-0 md:mt-0 md:flex-row md:items-center md:gap-6">
            <Link to="/home">
              <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="flex items-center  gap-x-2 p-1 font-medium hover:text-gray-600"
              >
                <Icon iconName={HomeIcon} className="h-4 w-4" />
                <a href="#" className="flex items-center">
                  Home
                </a>
              </Typography>
            </Link>
            <Link to="/courses">
              <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="flex items-center gap-x-2 p-1 font-medium hover:text-gray-600"
              >
                <Icon iconName={ViewfinderCircleIcon} className="h-4 w-4" />
                <a href="#" className="flex items-center">
                  Courses
                </a>
              </Typography>
            </Link>
            <Link to="/about-us">
              <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="flex items-center gap-x-2 p-1 font-medium hover:text-gray-600"
              >
                <Icon iconName={GlobeAsiaAustraliaIcon} className="h-4 w-4" />
                <a href="#" className="flex items-center">
                  About Us
                </a>
              </Typography>
            </Link>

            {(user?.role == "teacher" ||
              user?.role == "admin" ||
              user?.role == "pending") && (
              <Link to={`/${user?.role}/dashboard`} className="hidden lg:block">
                <Typography
                  as="li"
                  variant="small"
                  color="blue-gray"
                  className="flex items-center gap-x-2 p-1 font-medium"
                >
                  Dashboard
                </Typography>
              </Link>
            )}

            {user?.role == "student" && (
              <Link to="/my-course">
                <Typography
                  as="li"
                  variant="small"
                  color="blue-gray"
                  className="flex items-center gap-x-2 p-1 font-medium"
                >
                  My Course
                </Typography>
              </Link>
            )}
          </ul>
        </div>

        <IconButton
          variant="text"
          className="ms-auto me-2 h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent md:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <Icon iconName={XMarkIcon} className="w-7 h-6" />
          ) : (
            <Icon iconName={Bars4Icon} className="w-7 h-6" />
          )}
        </IconButton>

        <div className="flex justify-center gap-x-1">
          {/* cart */}
          {user?.role == "student" && (
            <div className="flex flex-col justify-center mx-2 sm:mx-3 md:mx-4">
              <Link to="/student/cart">
                {cart?.courseDetails?.length ? (
                  <Badge
                    content={cart?.courseDetails?.length}
                    className="min-w-18 min-h-18 text-xs p-0"
                  >
                    <Icon iconName={ShoppingCartIcon} className="w-6 h-6" />
                  </Badge>
                ) : (
                  <Icon iconName={ShoppingCartIcon} className="w-6 h-6" />
                )}
              </Link>
            </div>
          )}

          {/* wishlist */}
          {user?.role == "student" && (
            <div className="flex flex-col justify-center mx-2 sm:mx-3 md:mx-4">
              <Link to="/student/wishlist">
                {wishlist?.courseDetails?.length ? (
                  <Badge
                    content={wishlist?.courseDetails?.length}
                    className="min-w-18 min-h-18 text-xs p-0"
                  >
                    <Icon iconName={HeartIcon} className="w-6 h-6" />
                  </Badge>
                ) : (
                  <Icon iconName={HeartIcon} className="w-6 h-6" />
                )}
              </Link>
            </div>
          )}

          {/* notification */}
          {/* {user?._id && (
            <div className="flex flex-col justify-center mx-2 sm:mx-3 md:mx-4">
              <Link to="/ ">
                {wishlist?.courseDetails?.length ? (
                  <Badge
                    content={wishlist?.courseDetails?.length}
                    className="min-w-18 min-h-18 text-xs p-0"
                  >
                    <Icon iconName={BellIcon} className="w-6 h-6" />
                  </Badge>
                ) : (
                  <Icon iconName={BellIcon} className="w-6 h-6" />
                )}
              </Link>
            </div>
          )} */}

          {/* notification */}
          {user?._id && (
            <div className="flex flex-col justify-center mx-2 sm:mx-3 md:mx-4">
              <NotificationPopover
                notification={notification}
                adminNotification={adminNotification}
                reloadNotification={reloadNotification}
                setReloadNotification={setReloadNotification}
              />
            </div>
          )}

          {user?.email ? (
            <div className="sm:ms-8">
              <ProfileMenu />
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="gradient"
                  size="sm"
                  className="hidden md:inline-block to-blue-600 hover:to-blue-500"
                >
                  <span>Log In</span>
                </Button>
              </Link>
              {/* <Link to="/register">
                <Button
                  variant="gradient"
                  size="sm"
                  className="hidden md:inline-block to-blue-600 hover:to-blue-500"
                >
                  <span>Sign Up</span>
                </Button>
              </Link> */}
            </>
          )}
        </div>
      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto">
          <Link to="/home">
            <Typography
              as="li"
              variant="small"
              color="blue-gray"
              className="flex items-center  gap-x-2 p-1 font-medium hover:text-gray-600"
            >
              <Icon iconName={HomeIcon} className="h-4 w-4" />
              <a href="#" className="flex items-center">
                Home
              </a>
            </Typography>
          </Link>
          <Link to="/courses">
            <Typography
              as="li"
              variant="small"
              color="blue-gray"
              className="flex items-center gap-x-2 p-1 font-medium hover:text-gray-600"
            >
              <Icon iconName={ViewfinderCircleIcon} className="h-4 w-4" />
              <a href="#" className="flex items-center">
                Courses
              </a>
            </Typography>
          </Link>
          {!user?.email && (
            <div className="flex items-center gap-x-1">
              <Link to="/login" className="w-full">
                <Button fullWidth variant="text" size="sm" className=" w-full">
                  <span>Log In</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Collapse>
    </Navbar>
  );
}

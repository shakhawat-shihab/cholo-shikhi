import React from "react";
import {
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../atoms/icon/icon";
import { removeUserData } from "../../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

type Props = {};

const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    route: "/my-profile",
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
    route: "/edit-profile",
  },
  {
    label: "Log Out",
    icon: PowerIcon,
    route: "/log-out",
  },
];

export default function ProfileMenu({}: Props) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const closeMenu = () => setIsMenuOpen(false);

  const logOutEvent = () => {
    dispatch(removeUserData());
    navigate("/");
  };

  let user = useSelector((state: any) => state.auth.userData);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="Profile Picture"
            className="border border-gray-900 p-0.5 "
            style={{ height: "50px", width: "50px", minWidth: "50px" }}
            src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon, route }) => {
          // last item is log out
          // const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={closeMenu}
              className={`flex items-center gap-1 p-2 rounded ${
                route == "/log-out"
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {route == "/log-out" ? (
                <div
                  className="flex items-center w-full"
                  onClick={() => logOutEvent()}
                >
                  <Icon
                    iconName={icon}
                    strokeWidth={2}
                    className="h-4 w-4 text-red-500"
                  />
                  <Typography
                    as="span"
                    variant="small"
                    className="font-normal ms-2"
                    color="red"
                  >
                    {label}
                  </Typography>
                </div>
              ) : (
                <Link to={route} className="w-full">
                  <div className="flex items-center ">
                    <Icon
                      iconName={icon}
                      strokeWidth={2}
                      className="h-4 w-4 "
                    />
                    <Typography
                      as="span"
                      variant="small"
                      className="font-normal ms-2"
                      color="inherit"
                    >
                      {label == "My Profile" ? (
                        <span className="capitalize">
                          {user?.userRef?.userName}
                        </span>
                      ) : (
                        label
                      )}
                    </Typography>
                  </div>
                </Link>
              )}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

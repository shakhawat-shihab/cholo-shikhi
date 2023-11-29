import {
  Button,
  Drawer,
  IconButton,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React from "react";

type Props = { openDrawer: () => void; closeDrawer: () => void; open: boolean };

export default function CourseFilteringDrawer({
  openDrawer,
  open,
  closeDrawer,
}: Props) {
  return (
    <Drawer open={open} onClose={closeDrawer}>
      <div className="flex items-center justify-between px-4 pb-2">
        <Typography variant="h5" color="blue-gray">
          Contact Us
        </Typography>
        <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </div>
      <div className="mb-5 px-4">
        <Typography variant="small" color="gray" className="font-normal ">
          Write the message and then click button.
        </Typography>
      </div>
      <form className="flex flex-col gap-6 p-4">
        <Typography variant="h6" color="blue-gray" className="-mb-3">
          Your Email
        </Typography>

        <Textarea rows={6} label="Message" />
        <Button>Send Message</Button>
      </form>
    </Drawer>
  );
}

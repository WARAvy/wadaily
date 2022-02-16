import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Modal from "./Modal";

export default function NotificationModal() {
    const [visible, setVisible] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [viewing, setViewing] = useState(0)

    useEffect(() => {
        fetch('/api/notification')
            .then(e => e.json())
            .then(x => {
                const seen = JSON.parse(window.localStorage.getItem('seen-announcements')) || []
                const e = x.filter(z => {
                    return !seen.includes(z._id)
                })
                if (e.length !== 0) {
                    setNotifications(x)
                    setVisible(true)
                }
            })

    }, [])

    useEffect(() => {
        const announcements = JSON.parse(window.localStorage.getItem('seen-announcements')) || []
        if (notifications[viewing]) {
            if (!announcements.includes(notifications[viewing]._id)) announcements.push(notifications[viewing]._id)
            window.localStorage.setItem('seen-announcements', JSON.stringify(announcements))
        }
    })

    const navigate = (n) => () => {
        if (viewing + n >= 0 && viewing + n <= notifications.length) setViewing(viewing + n);
    }

    return (visible && <Modal style={{minWidth: '30%'}}>
            <p className="absolute top-3 right-4 cursor-pointer" onClick={() => setVisible(false)}>x</p>
            <p className="text-xl">{notifications[viewing].title}</p>
            <p dangerouslySetInnerHTML={{__html: notifications[viewing].text}}></p>
            {notifications[viewing].link && <a href={notifications[viewing].link} className="underline mt-2">Click here</a>}
            <div className={"flex items-center self-center mt-2"}>
                <IoIosArrowBack className={`mr-2 ${viewing === 0 ? "text-gray-300" : "cursor-pointer"}`} onClick={navigate(-1)} />
                <p>{viewing + 1} of {notifications.length}</p>
                <IoIosArrowForward className={`ml-2 ${viewing === (notifications.length - 1) ? "text-gray-300" : "cursor-pointer"}`} onClick={navigate(1)} />
            </div>
        </Modal>)
}
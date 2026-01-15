import React from 'react';
import { StyleSheet } from 'react-native';

// Import semua icon SVG kamu
import AltArrowDown from "../assets/icon/Bold/AltArrowDown.svg";
import ArrowLeft from "../assets/icon/Bold/ArrowLeft.svg";
import ArrowLeftOutline from "../assets/icon/Linear/ArrowLeft.svg";
import Eye from "../assets/icon/Bold/Eye.svg";
import EyeClosed from "../assets/icon/Bold/EyeClosed.svg";
import UserRounded from "../assets/icon/Bold/UserRounded.svg";
import UserHeart from "../assets/icon/Bold/UserHeart.svg";
import Calendar from "../assets/icon/Bold/Calendar.svg";
import Letter from "../assets/icon/Bold/Letter.svg";
import CloseCircle from "../assets/icon/Bold/CloseCircle.svg";
import InfoCircle from "../assets/icon/Bold/InfoCircle.svg";
import InfoSquare from "../assets/icon/Bold/InfoSquare.svg";
import HomeSmile from "../assets/icon/Bold/HomeSmile.svg";
import Cosmetic from "../assets/icon/Bold/Cosmetic.svg";
import Whatsapp from "../assets/icon/Bold/Whatsapp.svg";
import Bell from "../assets/icon/Bold/Bell.svg";
import Magnifer from "../assets/icon/Bold/Magnifer.svg";
import CalendarMark from "../assets/icon/Bold/CalendarMark.svg";
import ClockSquare from "../assets/icon/Bold/ClockSquare.svg";
import RoundArrowRightUp from "../assets/icon/Bold/RoundArrowRightUp.svg";
import RoundAltArrowRight from "../assets/icon/Bold/RoundAltArrowRight.svg";
import Gift from "../assets/icon/Bold/Gift.svg";
import UserCircle from "../assets/icon/Bold/UserCircle.svg";
import Filter from "../assets/icon/Bold/Filter.svg";
import Filters from "../assets/icon/Bold/Filters.svg";
import Stethoscope from "../assets/icon/Bold/Stethoscope.svg";
import MapPoint from "../assets/icon/Bold/MapPoint.svg";
import Pen2 from "../assets/icon/Bold/Pen2.svg";
import Share from "../assets/icon/Bold/Share.svg";
import History3 from "../assets/icon/Bold/History3.svg";
import CheckCircle from "../assets/icon/Bold/CheckCircle.svg";
import UploadSquare from "../assets/icon/Bold/UploadSquare.svg";
import QuestionSquare from "../assets/icon/Bold/QuestionSquare.svg";
import LockPassword from "../assets/icon/Bold/LockPassword.svg";
import Gps from "../assets/icon/Bold/GPS.svg";
import Card from "../assets/icon/Bold/UserId.svg";
import UserGroup from "../assets/icon/Bold/UsersGroupRounded.svg";
import FullName from "../assets/icon/Bold/UserHands.svg";
import PhoneCalling from "../assets/icon/Bold/PhoneCalling.svg";
import ServerPath from "../assets/icon/Bold/ServerSquare.svg";
import KeySquare2 from "../assets/icon/Bold/KeySquare2.svg";
import Ticket from "../assets/icon/Bold/Ticket.svg";
import CPUio from "../assets/icon/Bold/CPU.svg";
import BookBookmark from "../assets/icon/Bold/BookBookmark.svg";
import PasswordMinimalistic from "../assets/icon/Bold/PasswordMinimalistic.svg";

import MoneyBag from "../assets/icon/Bold/MoneyBag.svg";
import Buildings from "../assets/icon/Bold/Buildings.svg";
import Sale from "../assets/icon/Bold/Sale.svg";
import CaseRound from "../assets/icon/Bold/CaseRound.svg";
import ChatLine from "../assets/icon/Bold/ChatLine.svg"
import Hospital from "../assets/icon/Bold/Hospital.svg"
import UserHandUp from "../assets/icon/Bold/UserHandUp.svg"
import Pill from "../assets/icon/Bold/Pill.svg"
import HeartPulse2 from "../assets/icon/Bold/HeartPulse2.svg"
import PeopleNearby from "../assets/icon/Bold/PeopleNearby.svg"
import Documents from "../assets/icon/Bold/Documents.svg"
import BillList from "../assets/icon/Bold/BillList.svg"




import { colors } from '../utils/colors';

// Daftar icon dalam object, bukan array (lebih cepat diakses)
const ICONS = {
  "cpu": CPUio,
  "documents": Documents,
  "pill": Pill,
  "chevron-forward-circle": RoundAltArrowRight,
  "billlist":BillList,
  "peoplenearby": PeopleNearby,
  "heartpulse":HeartPulse2,
  "userhandup":UserHandUp,
  "hospital":Hospital,
  "chat":ChatLine,
  "book":BookBookmark,
  "magnifer": Magnifer,
  "passmin":PasswordMinimalistic,
  "ticket":Ticket,
  "key-square":KeySquare2,
  "lock-password":LockPassword,
  "question-square": QuestionSquare,
  "pen2": Pen2,
  "check-circle": CheckCircle,
  "upload-square": UploadSquare,
  "history-3": History3,
  "share": Share,
  "map-point": MapPoint,
  "stethoscope": Stethoscope,
  "gift": Gift,
  "filter": Filter,
  "filters": Filters,
  "round-arrow-right-up": RoundArrowRightUp,
  "round-alt-arrow-right": RoundAltArrowRight,
  "clock-square": ClockSquare,
  "calendar-mark": CalendarMark,
  "home-smile": HomeSmile,
  "bell": Bell,
  "cosmetic": Cosmetic,
  "whatsapp": Whatsapp,
  "alt-arrow-down": AltArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-left-outline": ArrowLeftOutline,
  "eye": Eye,
  "eye-closed": EyeClosed,
  "user-rounded": UserRounded,
  "user-circle": UserCircle,
  "user-heart": UserHeart,
  "calendar": Calendar,
  "letter": Letter,
  "close-circle": CloseCircle,
  "info-circle": InfoCircle,
  "info-square": InfoSquare,
  "gps": Gps,
  "card": Card,
  "user-group": UserGroup,
  "full-name": FullName,
  "phone-call":PhoneCalling,
  "server-path":ServerPath,
  "money":MoneyBag,
  "building":Buildings,
  "sale":Sale,
  "case":CaseRound,
};

export default function MyIcon({ name = "eye", size = 24, color = colors.blueGray[300] }) {
  const IconComponent = ICONS[name];

  if (!IconComponent) {
    console.warn(`Icon '${name}' tidak ditemukan!`);
    return null; // Hindari error render
  }

  return <IconComponent width={size} height={size} style={{ color:color}} />;
}

const styles = StyleSheet.create({});

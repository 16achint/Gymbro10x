import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { MemberShip } from "../models/membership.model.js";
import { Dashboard } from "../models/dashboard.model.js";

const dashboard = asyncHandler(async (req, res, next) => {
  const memberShips = await MemberShip.find({});

  let currentDate = new Date();
  const monthly = currentDate.setMonth(currentDate.getMonth() - 1);
  const weekly = currentDate.setDate(currentDate.getDate() - 7);

  let monthlyAmount = 0;
  let weeklyAmount = 0;
  let totalMontlyAmount = 0;

  memberShips.forEach((memberShip) => {
    const startDateObject = new Date(
      memberShip.startDate.split("-").reverse().join("-")
    );
    const endDateObject = new Date(
      memberShip.endDate.split("-").reverse().join("-")
    );
    if (startDateObject > monthly) {
      monthlyAmount += memberShip.paidAmount;
    }
    if (startDateObject > weekly) {
      weeklyAmount += memberShip.paidAmount;
    }

    totalMontlyAmount += memberShip.paidAmount;
  });

  const newdashboard = await Dashboard.create({
    montlyCollection: monthlyAmount,
    weeklyCollection: weeklyAmount,
    totalCollection: totalMontlyAmount,
  });

  res.status(201).json(new ApiResponse(201, newdashboard, "dashboard info"));
});

export { dashboard };

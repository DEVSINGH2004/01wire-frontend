import { gql } from "@apollo/client";

export interface IPaymentMethods {
  paymentMethods: { razorpay: boolean; inrPerCredit: number };
}
export const PAYMENT_METHODS = gql`
  query paymentMethods {
    paymentMethods {
      razorpay
      inrPerCredit
    }
  }
`;

export interface IRazorpayOrder {
  keyId: string;
  orderId: string;
  amount: number; // paise
  currency: string;
  credits: number;
  prId?: number;
}
export interface ICreateRazorpayOrder {
  createRazorpayOrder: IRazorpayOrder;
}
export const CREATE_RAZORPAY_ORDER = gql`
  mutation createRazorpayOrder($articleId: String!) {
    createRazorpayOrder(articleId: $articleId) {
      keyId
      orderId
      amount
      currency
      credits
      prId
    }
  }
`;

export interface IPaymentResult {
  status: "PAID" | "PENDING";
  submitted: boolean;
  message?: string;
}
export interface IVerifyRazorpayPayment {
  verifyRazorpayPayment: IPaymentResult;
}
export const VERIFY_RAZORPAY_PAYMENT = gql`
  mutation verifyRazorpayPayment($params: RazorpayVerifyInput!) {
    verifyRazorpayPayment(params: $params) {
      status
      submitted
      message
    }
  }
`;

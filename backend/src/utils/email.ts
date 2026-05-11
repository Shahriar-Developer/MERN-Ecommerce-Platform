import nodemailer from 'nodemailer';
import { IOrder } from '../types';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

interface EmailOptions { to: string; subject: string; html: string; }

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    ...options,
  });
};

const baseStyle = `font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px;`;
const headerStyle = `background:#6C63FF;padding:30px;text-align:center;border-radius:8px 8px 0 0;`;
const bodyStyle = `background:white;padding:30px;border-radius:0 0 8px 8px;`;

export const emailTemplates = {
  verifyEmail: (name: string, verificationUrl: string) => ({
    subject: 'Verify Your Email - Ghorer Bazar',
    html: `<div style="${baseStyle}">
      <div style="${headerStyle}"><h1 style="color:white;margin:0;">Ghorer Bazar</h1></div>
      <div style="${bodyStyle}">
        <h2>Hello, ${name}!</h2>
        <p style="color:#666;line-height:1.7;">Thank you for registering. Please verify your email to activate your account.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${verificationUrl}" style="background:#6C63FF;color:white;padding:14px 32px;text-decoration:none;border-radius:6px;font-size:16px;font-weight:bold;display:inline-block;">Verify Email Address</a>
        </div>
        <p style="color:#999;font-size:13px;">Link expires in 24 hours. If you didn't register, ignore this email.</p>
      </div></div>`,
  }),

  orderConfirmation: (name: string, order: IOrder) => ({
    subject: `Order Confirmed #${order.orderNumber} - Ghorer Bazar`,
    html: `<div style="${baseStyle}">
      <div style="${headerStyle}"><h1 style="color:white;margin:0;">Ghorer Bazar</h1></div>
      <div style="${bodyStyle}">
        <h2 style="color:#28a745;">Order Confirmed!</h2>
        <p>Hello <strong>${name}</strong>, your order has been confirmed.</p>
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-BD')}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Total:</strong> BDT ${order.totalPrice.toFixed(2)}</p>
          ${order.paymentMethod === 'COD' ? '<p style="color:#ff9800;"><strong>Note:</strong> Payment will be collected when order is delivered.</p>' : '<p style="color:#28a745;"><strong>✓ Payment Received</strong></p>'}
        </div>
        <h3>Items:</h3>
        ${order.items.map(i => `<p>• ${i.name} × ${i.quantity} = BDT ${(i.price * i.quantity).toFixed(2)}</p>`).join('')}
        <p style="color:#666;margin-top:20px;">We'll notify you when your order is on its way!</p>
      </div></div>`,
  }),

  orderApproved: (name: string, order: IOrder) => ({
    subject: `Order Approved & Processing #${order.orderNumber} - Ghorer Bazar`,
    html: `<div style="${baseStyle}">
      <div style="${headerStyle}"><h1 style="color:white;margin:0;">Ghorer Bazar</h1></div>
      <div style="${bodyStyle}">
        <h2 style="color:#6C63FF;">Delivery Process Started!</h2>
        <p>Hello <strong>${name}</strong>, great news! Your order has been approved and delivery process has started.</p>
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
          <p><strong>Order #:</strong> ${order.orderNumber}</p>
          <p><strong>Status:</strong> Processing for Delivery</p>
          <p><strong>Total:</strong> BDT${order.totalPrice.toFixed(2)}</p>
          ${order.paymentMethod === 'COD' ? '<p style="color:#ff9800;"><strong>Note:</strong> Payment will be collected at delivery.</p>' : ''}
        </div>
        <p style="color:#666;">You'll receive another notification once shipped with tracking details.</p>
      </div></div>`,
  }),

  orderShipped: (name: string, order: IOrder, trackingNumber?: string) => ({
    subject: `Order Shipped #${order.orderNumber} - Ghorer Bazar`,
    html: `<div style="${baseStyle}">
      <div style="${headerStyle}"><h1 style="color:white;margin:0;">Ghorer Bazar</h1></div>
      <div style="${bodyStyle}">
        <h2 style="color:#17a2b8;">Order Shipped!</h2>
        <p>Hello <strong>${name}</strong>, your order is on its way!</p>
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
          <p><strong>Order #:</strong> ${order.orderNumber}</p>
          ${trackingNumber ? `<p><strong>Tracking #:</strong> ${trackingNumber}</p>` : ''}
          <p><strong>Est. Delivery:</strong> 3-5 business days</p>
          ${order.paymentMethod === 'COD' ? '<p style="color:#ff9800;"><strong>Note:</strong> Payment will be collected upon delivery.</p>' : ''}
        </div>
      </div></div>`,
  }),

  orderConfirmed: (name: string, order: IOrder) => ({
    subject: `Order Confirmed #${order.orderNumber} - Ghorer Bazar`,
    html: `<div style="${baseStyle}">
      <div style="${headerStyle}"><h1 style="color:white;margin:0;">Ghorer Bazar</h1></div>
      <div style="${bodyStyle}">
        <h2 style="color:#28a745;">✓ Order Confirmed!</h2>
        <p>Hello <strong>${name}</strong>, your order has been confirmed and verified.</p>
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
          <p><strong>Order #:</strong> ${order.orderNumber}</p>
          <p><strong>Status:</strong> <strong style="color:#28a745;">CONFIRMED</strong></p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          ${order.paymentMethod === 'COD' ? '<p style="color:#ff9800;"><strong>Note:</strong> Payment will be collected when order is delivered.</p>' : '<p style="color:#28a745;"><strong>✓ Payment Received</strong></p>'}
          ${order.items.some(i => i.isPreOrder) ? '<p style="color:#ff9800;"><strong>Note:</strong> This order contains pre-order items. We will notify you when items are in stock.</p>' : ''}
        </div>
        <p style="color:#666;">Your order is being prepared for delivery.</p>
      </div></div>`,
  }),

  orderDelivered: (name: string, order: IOrder) => ({
    subject: `Order Delivered #${order.orderNumber} - Ghorer Bazar`,
    html: `<div style="${baseStyle}">
      <div style="${headerStyle}"><h1 style="color:white;margin:0;">Ghorer Bazar</h1></div>
      <div style="${bodyStyle}">
        <h2 style="color:#28a745;">✓ Order Delivered!</h2>
        <p>Hello <strong>${name}</strong>, your order has been successfully delivered!</p>
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
          <p><strong>Order #:</strong> ${order.orderNumber}</p>
          <p><strong>Delivered At:</strong> ${order.deliveredAt ? new Date(order.deliveredAt).toLocaleString('en-BD') : 'Today'}</p>
          ${order.paymentMethod === 'COD' ? '<p style="color:#28a745;"><strong>✓ Payment Collected</strong></p>' : ''}
        </div>
        <p style="color:#666;">Thank you for shopping with Ghorer Bazar! If you have any questions, feel free to contact us.</p>
      </div></div>`,
  }),

  orderCancelled: (name: string, order: IOrder, reason?: string) => ({
    subject: `Order Cancelled #${order.orderNumber} - Ghorer Bazar`,
    html: `<div style="${baseStyle}">
      <div style="${headerStyle}"><h1 style="color:white;margin:0;">Ghorer Bazar</h1></div>
      <div style="${bodyStyle}">
        <h2 style="color:#dc3545;">Order Cancelled</h2>
        <p>Hello <strong>${name}</strong>, your order has been cancelled.</p>
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
          <p><strong>Order #:</strong> ${order.orderNumber}</p>
          <p><strong>Status:</strong> <strong style="color:#dc3545;">CANCELLED</strong></p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p><strong>Refund Amount:</strong> BDT ${order.totalPrice.toFixed(2)}</p>
        </div>
        <p style="color:#666;">If your payment was already processed, refund will be initiated within 3-5 business days.</p>
      </div></div>`,
  }),

  resetPassword: (name: string, resetUrl: string) => ({
    subject: 'Reset Your Password - Ghorer Bazar',
    html: `<div style="${baseStyle}">
      <div style="${headerStyle}"><h1 style="color:white;margin:0;">Ghorer Bazar</h1></div>
      <div style="${bodyStyle}">
        <h2>Password Reset</h2>
        <p>Hello <strong>${name}</strong>, you requested to reset your password.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${resetUrl}" style="background:#dc3545;color:white;padding:14px 32px;text-decoration:none;border-radius:6px;font-size:16px;font-weight:bold;display:inline-block;">Reset Password</a>
        </div>
        <p style="color:#999;font-size:13px;">Expires in 30 minutes. Ignore if you didn't request this.</p>
      </div></div>`,
  }),
};

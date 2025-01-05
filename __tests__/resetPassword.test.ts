import nodemailer from 'nodemailer';
import { sendPasswordResetEmail } from '../src/email/resetPassword';

jest.mock('nodemailer');

describe('sendPasswordResetEmail', () => {
  let mockSendMail: jest.Mock;

  beforeAll(() => {
    mockSendMail = jest.fn().mockResolvedValue({ messageId: 'abc123' });
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send a password reset email with correct details', async () => {
    const testEmail = 'user@example.com';
    const testToken = 'test_token_123';

    await sendPasswordResetEmail(testEmail, testToken);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    expect(mockSendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: testEmail,
      subject: 'Password Reset',
      text: expect.stringContaining('reset-password?token=test_token_123'),
      html: expect.stringContaining('reset-password?token=test_token_123'),
    });
  });

  it('should handle errors thrown by nodemailer', async () => {
    mockSendMail.mockRejectedValueOnce(new Error('Nodemailer Error'));

    await expect(
      sendPasswordResetEmail('user@example.com', 'bad_token'),
    ).rejects.toThrow('Nodemailer Error');
  });
});

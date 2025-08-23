import { Request, Response } from 'express';
import httpStatus from 'http-status';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UploadService } from './upload.service';

const generateQuestions = catchAsync(
  async (req: Request & { file?: any }, res: Response) => {
    const file = req.file;

    if (!file) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'No file uploaded',
      });
    }

    const questions = await UploadService.generateQuestionsFromDocument(file);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Questions generated successfully',
      data: questions,
    });
  }
);

const generateQuestionsWithAI = catchAsync(
  async (req: Request & { file?: any }, res: Response) => {
    const file = req.file;

    if (!file) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'No file uploaded',
      });
    }

    try {
      // Extract text from the file
      let extractedText = '';

      if (file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(file.buffer);
        extractedText = pdfData.text;
      } else if (
        file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        extractedText = result.value;
      } else if (file.mimetype === 'text/plain') {
        // Handle plain text files
        extractedText = file.buffer.toString('utf8');
      } else {
        return sendResponse(res, {
          statusCode: httpStatus.BAD_REQUEST,
          success: false,
          message:
            'Unsupported file type. Only PDF, DOCX, and TXT are supported.',
        });
      }

      // Generate questions using OpenAI
      const questions = await UploadService.generateQuestionsFromOpenAI(
        extractedText
      );

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'AI-generated questions created successfully',
        data: questions,
      });
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error generating questions with AI:', errorMsg);
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: `Failed to generate questions: ${errorMsg}`,
      });
    }
  }
);

export const UploadController = {
  generateQuestions,
  generateQuestionsWithAI,
};

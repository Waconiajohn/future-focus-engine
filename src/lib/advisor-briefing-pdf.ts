/**
 * PDF Generator for Advisor Briefing Documents
 * Creates a comprehensive briefing document for tax/financial advisor meetings
 */

import jsPDF from 'jspdf';
import type { Strategy, RetirementRange } from '@/types/persona';
import { getAdvisorInfoForStrategy } from '@/data/strategy-advisor-info';
import { calculatePersonalizedEstimate, formatEstimate } from '@/lib/personalized-estimates';
import { getStrategyExample } from '@/data/strategy-examples';

export interface ClientProfile {
  name?: string;
  age?: number;
  ageBand?: string;
  maritalStatus?: string;
  employmentStatus?: string;
  retirementRange?: RetirementRange;
  realEstateRange?: string;
}

export interface QuestionAnswer {
  questionId: string;
  questionLabel: string;
  answer: string;
}

export interface BriefingData {
  strategy: Strategy;
  clientProfile: ClientProfile;
  answers: QuestionAnswer[];
  generatedDate: string;
}

export interface MultiBriefingData {
  strategies: Strategy[];
  clientProfile: ClientProfile;
  answers: QuestionAnswer[];
  generatedDate: string;
}

// Colors
const colors = {
  primary: [59, 130, 246] as [number, number, number],
  text: [30, 41, 59] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  green: [34, 197, 94] as [number, number, number],
  headerBg: [15, 23, 42] as [number, number, number],
  lightBg: [241, 245, 249] as [number, number, number],
  accent: [249, 250, 251] as [number, number, number],
};

export async function generateAdvisorBriefingPDF(data: BriefingData): Promise<void> {
  const { strategy, clientProfile, answers, generatedDate } = data;
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  const advisorInfo = getAdvisorInfoForStrategy(strategy.id);
  const example = getStrategyExample(strategy.id);
  const estimate = calculatePersonalizedEstimate(
    strategy.id,
    clientProfile.retirementRange || '500k-1M',
    clientProfile.age || 55
  );

  // Helper: check page break
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 25) {
      pdf.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper: add section title
  const addSectionTitle = (title: string, icon?: string) => {
    checkPageBreak(20);
    pdf.setFontSize(13);
    pdf.setTextColor(...colors.primary);
    pdf.setFont('helvetica', 'bold');
    pdf.text(icon ? `${icon}  ${title}` : title, margin, yPos);
    yPos += 8;
    pdf.setTextColor(...colors.text);
  };

  // ==========================================
  // HEADER
  // ==========================================
  pdf.setFillColor(...colors.headerBg);
  pdf.rect(0, 0, pageWidth, 50, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Tax Strategy Briefing', margin, 22);

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(strategy.title, margin, 32);

  pdf.setFontSize(9);
  pdf.setTextColor(200, 200, 200);
  pdf.text(`Prepared: ${generatedDate}`, margin, 42);
  pdf.text(`For discussion with: ${advisorInfo.professionalType}`, pageWidth - margin - 60, 42);

  yPos = 60;

  // ==========================================
  // SECTION 1: CLIENT SUMMARY
  // ==========================================
  addSectionTitle('Client Summary');

  pdf.setFillColor(...colors.lightBg);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F');

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...colors.text);

  const clientDetails = [
    ['Name:', clientProfile.name || 'Not provided'],
    ['Age:', clientProfile.ageBand || 'Not provided'],
    ['Marital Status:', clientProfile.maritalStatus || 'Not provided'],
    ['Employment:', clientProfile.employmentStatus || 'Not provided'],
    ['Retirement Assets:', clientProfile.retirementRange || 'Not provided'],
  ];

  let detailY = yPos + 8;
  const col1X = margin + 8;
  const col2X = pageWidth / 2 + 5;

  clientDetails.forEach((detail, i) => {
    const x = i < 3 ? col1X : col2X;
    const y = i < 3 ? detailY + i * 8 : detailY + (i - 3) * 8;
    
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.muted);
    pdf.text(detail[0], x, y);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.text);
    pdf.text(detail[1], x + 35, y);
  });

  yPos += 42;

  // ==========================================
  // SECTION 2: STRATEGY OVERVIEW
  // ==========================================
  addSectionTitle('Strategy Overview');

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('What This Strategy Is:', margin, yPos);
  yPos += 6;

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...colors.muted);
  const whatItIs = strategy.whatThisIs || strategy.description || '';
  const whatItIsLines = pdf.splitTextToSize(whatItIs, pageWidth - 2 * margin);
  whatItIsLines.forEach((line: string) => {
    checkPageBreak(6);
    pdf.text(line, margin, yPos);
    yPos += 5;
  });

  yPos += 5;

  if (strategy.whyItAppears) {
    pdf.setTextColor(...colors.text);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Why This May Apply to You:', margin, yPos);
    yPos += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.muted);
    const whyLines = pdf.splitTextToSize(strategy.whyItAppears, pageWidth - 2 * margin);
    whyLines.forEach((line: string) => {
      checkPageBreak(6);
      pdf.text(line, margin, yPos);
      yPos += 5;
    });
  }

  yPos += 8;

  // ==========================================
  // SECTION 3: CLIENT-SPECIFIC SITUATION
  // ==========================================
  if (answers.length > 0) {
    addSectionTitle('Your Specific Situation');

    pdf.setFillColor(...colors.accent);
    
    answers.forEach((qa) => {
      checkPageBreak(18);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.muted);
      pdf.text(qa.questionLabel, margin, yPos);
      yPos += 5;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.text);
      pdf.text(qa.answer, margin + 5, yPos);
      yPos += 8;
    });

    yPos += 5;
  }

  // ==========================================
  // SECTION 4: ESTIMATED SAVINGS
  // ==========================================
  checkPageBreak(40);
  addSectionTitle('Estimated Savings Analysis');

  pdf.setFillColor(236, 253, 245); // Light green
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 28, 3, 3, 'F');

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.green);
  pdf.text(formatEstimate(estimate), margin + 10, yPos + 14);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...colors.muted);
  pdf.text(estimate.explanation, margin + 10, yPos + 22);

  yPos += 35;

  pdf.setFontSize(8);
  pdf.setTextColor(...colors.muted);
  pdf.setFont('helvetica', 'italic');
  const disclaimer = 'Note: This estimate is based on general assumptions and example scenarios. Actual savings will depend on your specific circumstances. Consult with a qualified professional for personalized analysis.';
  const disclaimerLines = pdf.splitTextToSize(disclaimer, pageWidth - 2 * margin);
  disclaimerLines.forEach((line: string) => {
    pdf.text(line, margin, yPos);
    yPos += 4;
  });

  yPos += 8;

  // ==========================================
  // SECTION 5: QUESTIONS FOR YOUR ADVISOR
  // ==========================================
  checkPageBreak(40);
  addSectionTitle('Questions to Discuss With Your Advisor');

  advisorInfo.questionsForAdvisor.forEach((question, i) => {
    checkPageBreak(10);
    
    pdf.setFillColor(...colors.primary);
    pdf.circle(margin + 3, yPos - 1.5, 2.5, 'F');
    
    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);
    pdf.text((i + 1).toString(), margin + 1.8, yPos);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.text);
    pdf.text(question, margin + 10, yPos);
    yPos += 8;
  });

  yPos += 5;

  // ==========================================
  // SECTION 6: DOCUMENTS TO BRING
  // ==========================================
  checkPageBreak(40);
  addSectionTitle('Documents to Gather');

  advisorInfo.documentsToGather.forEach((doc) => {
    checkPageBreak(8);
    
    pdf.setFontSize(10);
    pdf.setTextColor(...colors.text);
    pdf.text('☐', margin, yPos);
    pdf.text(doc, margin + 8, yPos);
    yPos += 7;
  });

  yPos += 5;

  // ==========================================
  // SECTION 7: IMPORTANT DEADLINES
  // ==========================================
  if (advisorInfo.deadlines && advisorInfo.deadlines.length > 0) {
    checkPageBreak(35);
    addSectionTitle('Important Deadlines & Timing');

    advisorInfo.deadlines.forEach((deadline) => {
      checkPageBreak(10);
      
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.text);
      pdf.text('⏰', margin, yPos);
      
      const deadlineLines = pdf.splitTextToSize(deadline, pageWidth - 2 * margin - 10);
      deadlineLines.forEach((line: string, i: number) => {
        pdf.text(line, margin + 8, yPos + (i * 5));
      });
      yPos += deadlineLines.length * 5 + 3;
    });

    yPos += 5;
  }

  // ==========================================
  // SECTION 8: EXAMPLE SCENARIO
  // ==========================================
  if (example) {
    checkPageBreak(50);
    addSectionTitle('Example Scenario');

    pdf.setFillColor(...colors.lightBg);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F');

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.muted);
    
    const scenarioLines = pdf.splitTextToSize(example.scenario, pageWidth - 2 * margin - 10);
    let scenarioY = yPos + 8;
    scenarioLines.slice(0, 6).forEach((line: string) => {
      pdf.text(line, margin + 5, scenarioY);
      scenarioY += 5;
    });

    yPos += 42;
  }

  // ==========================================
  // FOOTER: DISCLAIMER
  // ==========================================
  checkPageBreak(35);
  
  pdf.setDrawColor(...colors.muted);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.text);
  pdf.text('Educational Disclaimer', margin, yPos);
  yPos += 5;

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...colors.muted);
  const fullDisclaimer = `This document is for informational and educational purposes only. It does not constitute tax, legal, or financial advice. The strategies and estimates presented are based on general information and example scenarios. Individual circumstances vary significantly, and actual results will depend on your specific situation. Before implementing any tax or financial strategy, consult with a qualified ${advisorInfo.professionalType} who can review your complete financial picture and provide personalized recommendations.`;
  
  const disclaimerFinalLines = pdf.splitTextToSize(fullDisclaimer, pageWidth - 2 * margin);
  disclaimerFinalLines.forEach((line: string) => {
    checkPageBreak(5);
    pdf.text(line, margin, yPos);
    yPos += 4;
  });

  // ==========================================
  // PAGE NUMBERS
  // ==========================================
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.muted);
    pdf.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // ==========================================
  // SAVE
  // ==========================================
  const filename = `strategy-briefing-${strategy.id}-${generatedDate.replace(/\//g, '-')}.pdf`;
  pdf.save(filename);
}

/**
 * Generate a consolidated PDF for multiple strategies
 */
export async function generateMultiStrategyBriefingPDF(data: MultiBriefingData): Promise<void> {
  const { strategies, clientProfile, answers, generatedDate } = data;
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Calculate total estimated savings
  let totalLow = 0;
  let totalHigh = 0;
  strategies.forEach(strategy => {
    const estimate = calculatePersonalizedEstimate(
      strategy.id,
      clientProfile.retirementRange || '500k-1M',
      clientProfile.age || 55
    );
    totalLow += estimate.lowEstimate;
    totalHigh += estimate.highEstimate;
  });

  // Helper: check page break
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 25) {
      pdf.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper: add section title
  const addSectionTitle = (title: string) => {
    checkPageBreak(20);
    pdf.setFontSize(13);
    pdf.setTextColor(...colors.primary);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin, yPos);
    yPos += 8;
    pdf.setTextColor(...colors.text);
  };

  // ==========================================
  // HEADER
  // ==========================================
  pdf.setFillColor(...colors.headerBg);
  pdf.rect(0, 0, pageWidth, 50, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Consolidated Tax Strategy Briefing', margin, 22);

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${strategies.length} Strategies for Discussion`, margin, 32);

  pdf.setFontSize(9);
  pdf.setTextColor(200, 200, 200);
  pdf.text(`Prepared: ${generatedDate}`, margin, 42);

  yPos = 60;

  // ==========================================
  // CLIENT SUMMARY
  // ==========================================
  addSectionTitle('Client Summary');

  pdf.setFillColor(...colors.lightBg);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F');

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...colors.text);

  const clientDetails = [
    ['Name:', clientProfile.name || 'Not provided'],
    ['Age:', clientProfile.ageBand || 'Not provided'],
    ['Marital Status:', clientProfile.maritalStatus || 'Not provided'],
    ['Employment:', clientProfile.employmentStatus || 'Not provided'],
    ['Retirement Assets:', clientProfile.retirementRange || 'Not provided'],
  ];

  let detailY = yPos + 8;
  const col1X = margin + 8;
  const col2X = pageWidth / 2 + 5;

  clientDetails.forEach((detail, i) => {
    const x = i < 3 ? col1X : col2X;
    const y = i < 3 ? detailY + i * 8 : detailY + (i - 3) * 8;
    
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.muted);
    pdf.text(detail[0], x, y);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.text);
    pdf.text(detail[1], x + 35, y);
  });

  yPos += 42;

  // ==========================================
  // EXECUTIVE SUMMARY
  // ==========================================
  addSectionTitle('Executive Summary');

  pdf.setFillColor(236, 253, 245);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F');

  pdf.setFontSize(10);
  pdf.setTextColor(...colors.text);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${strategies.length} tax strategies identified based on your profile`, margin + 10, yPos + 10);

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.green);
  const totalEstimate = totalLow === totalHigh 
    ? `$${totalLow.toLocaleString()}`
    : `$${totalLow.toLocaleString()} - $${totalHigh.toLocaleString()}`;
  pdf.text(`Combined Potential Savings: ${totalEstimate}`, margin + 10, yPos + 22);

  pdf.setFontSize(8);
  pdf.setTextColor(...colors.muted);
  pdf.text('Estimates based on your profile; actual savings will vary.', margin + 10, yPos + 30);

  yPos += 42;

  // ==========================================
  // YOUR RESPONSES (if any)
  // ==========================================
  if (answers.length > 0) {
    addSectionTitle('Your Planning Context');

    answers.forEach((qa) => {
      checkPageBreak(15);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.muted);
      pdf.text(qa.questionLabel, margin, yPos);
      yPos += 5;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.text);
      const answerLines = pdf.splitTextToSize(qa.answer, pageWidth - 2 * margin - 5);
      answerLines.forEach((line: string) => {
        pdf.text(line, margin + 5, yPos);
        yPos += 5;
      });
      yPos += 3;
    });

    yPos += 5;
  }

  // ==========================================
  // STRATEGY DETAILS
  // ==========================================
  addSectionTitle('Strategy Details');

  strategies.forEach((strategy, index) => {
    checkPageBreak(60);

    const advisorInfo = getAdvisorInfoForStrategy(strategy.id);
    const estimate = calculatePersonalizedEstimate(
      strategy.id,
      clientProfile.retirementRange || '500k-1M',
      clientProfile.age || 55
    );

    // Strategy header
    pdf.setFillColor(...colors.lightBg);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'F');
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.primary);
    pdf.text(`${index + 1}. ${strategy.title}`, margin + 5, yPos + 6);
    
    yPos += 12;

    // Strategy description
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.text);
    
    const whatItIs = strategy.whatThisIs || strategy.description || '';
    const descLines = pdf.splitTextToSize(whatItIs, pageWidth - 2 * margin);
    descLines.slice(0, 4).forEach((line: string) => {
      checkPageBreak(6);
      pdf.text(line, margin, yPos);
      yPos += 5;
    });

    yPos += 3;

    // Why it applies
    if (strategy.whyItAppears) {
      checkPageBreak(15);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.muted);
      pdf.text('Why This May Apply:', margin, yPos);
      yPos += 5;
      
      pdf.setFont('helvetica', 'normal');
      const whyLines = pdf.splitTextToSize(strategy.whyItAppears, pageWidth - 2 * margin);
      whyLines.slice(0, 3).forEach((line: string) => {
        pdf.text(line, margin, yPos);
        yPos += 5;
      });
    }

    yPos += 3;

    // Estimated savings for this strategy
    checkPageBreak(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.green);
    pdf.text(`Estimated Savings: ${formatEstimate(estimate)}`, margin, yPos);
    yPos += 5;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.muted);
    pdf.text(estimate.explanation, margin, yPos);
    
    yPos += 12;

    // Key questions for this strategy
    if (advisorInfo.questionsForAdvisor.length > 0) {
      checkPageBreak(20);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.text);
      pdf.text('Key Questions:', margin, yPos);
      yPos += 5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      advisorInfo.questionsForAdvisor.slice(0, 2).forEach((q) => {
        checkPageBreak(8);
        const qLines = pdf.splitTextToSize(`• ${q}`, pageWidth - 2 * margin - 5);
        qLines.forEach((line: string) => {
          pdf.text(line, margin + 3, yPos);
          yPos += 4;
        });
      });
    }

    yPos += 8;
  });

  // ==========================================
  // COMBINED DOCUMENT CHECKLIST
  // ==========================================
  checkPageBreak(40);
  addSectionTitle('Documents to Gather');

  const allDocs = new Set<string>();
  strategies.forEach(strategy => {
    const info = getAdvisorInfoForStrategy(strategy.id);
    info.documentsToGather.forEach(doc => allDocs.add(doc));
  });

  pdf.setFontSize(10);
  Array.from(allDocs).slice(0, 15).forEach((doc) => {
    checkPageBreak(8);
    pdf.setTextColor(...colors.text);
    pdf.text('☐', margin, yPos);
    pdf.text(doc, margin + 8, yPos);
    yPos += 7;
  });

  yPos += 5;

  // ==========================================
  // COMBINED DEADLINES
  // ==========================================
  const allDeadlines = new Set<string>();
  strategies.forEach(strategy => {
    const info = getAdvisorInfoForStrategy(strategy.id);
    if (info.deadlines) {
      info.deadlines.forEach(d => allDeadlines.add(d));
    }
  });

  if (allDeadlines.size > 0) {
    checkPageBreak(35);
    addSectionTitle('Important Deadlines & Timing');

    Array.from(allDeadlines).slice(0, 8).forEach((deadline) => {
      checkPageBreak(10);
      
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.text);
      pdf.text('⏰', margin, yPos);
      
      const deadlineLines = pdf.splitTextToSize(deadline, pageWidth - 2 * margin - 10);
      deadlineLines.forEach((line: string, i: number) => {
        pdf.text(line, margin + 8, yPos + (i * 5));
      });
      yPos += deadlineLines.length * 5 + 3;
    });

    yPos += 5;
  }

  // ==========================================
  // DISCLAIMER
  // ==========================================
  checkPageBreak(35);
  
  pdf.setDrawColor(...colors.muted);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.text);
  pdf.text('Educational Disclaimer', margin, yPos);
  yPos += 5;

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...colors.muted);
  const fullDisclaimer = `This document is for informational and educational purposes only. It does not constitute tax, legal, or financial advice. The strategies and estimates presented are based on general information and example scenarios. Individual circumstances vary significantly, and actual results will depend on your specific situation. Before implementing any tax or financial strategy, consult with a qualified professional who can review your complete financial picture and provide personalized recommendations.`;
  
  const disclaimerLines = pdf.splitTextToSize(fullDisclaimer, pageWidth - 2 * margin);
  disclaimerLines.forEach((line: string) => {
    checkPageBreak(5);
    pdf.text(line, margin, yPos);
    yPos += 4;
  });

  // ==========================================
  // PAGE NUMBERS
  // ==========================================
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.muted);
    pdf.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // ==========================================
  // SAVE
  // ==========================================
  const filename = `consolidated-briefing-${strategies.length}-strategies-${generatedDate.replace(/\//g, '-')}.pdf`;
  pdf.save(filename);
}

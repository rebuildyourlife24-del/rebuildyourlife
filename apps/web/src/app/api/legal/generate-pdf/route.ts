import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      bailiffName = "Deurwaarder", 
      bailiffEmail = "",
      clientName = "Client",
      clientAddress = "Adres",
      violationDate = new Date().toLocaleDateString('nl-NL'),
      details = "Hierbij maak ik bezwaar tegen het negeren van de correcte beslagvrije voet.",
      dossierNumber = "Onbekend"
    } = data;

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    
    // Embed the Helvetica font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add a blank page to the document
    const page = pdfDoc.addPage();

    // Get the width and height of the page
    const { width, height } = page.getSize();
    const margin = 50;
    const fontSize = 11;
    const maxWidth = width - margin * 2;

    let currentY = height - margin - 20;

    const wrapText = (text: string, fontToUse: any, size: number) => {
      const words = text.split(' ');
      let lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = fontToUse.widthOfTextAtSize(currentLine + " " + word, size);
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    const drawTextLines = (text: string, fontToUse = font, size = fontSize, extraSpace = 0) => {
      const lines = wrapText(text, fontToUse, size);
      for (const line of lines) {
        page.drawText(line, {
          x: margin,
          y: currentY,
          size,
          font: fontToUse,
          color: rgb(0, 0, 0),
        });
        currentY -= (size + 5);
      }
      currentY -= extraSpace;
    };

    // Header info
    drawTextLines(`Aan: ${bailiffName}`, fontBold, 12, 5);
    if (bailiffEmail) {
      drawTextLines(`E-mail: ${bailiffEmail}`, font, fontSize, 5);
    }
    
    currentY -= 20;
    drawTextLines(`Betreft: Bezwaar beslagvrije voet / VTLB-Lock overtreding`, fontBold, 12, 5);
    drawTextLines(`Dossiernummer: ${dossierNumber}`, fontBold, 11, 20);

    drawTextLines(`Datum: ${new Date().toLocaleDateString('nl-NL')}`, font, fontSize, 20);

    drawTextLines(`Geachte heer/mevrouw,`, font, fontSize, 10);

    const intro = `Namens cliënt ${clientName}, woonachtig te ${clientAddress}, richten wij ons tot u. Gebleken is dat bij de (aangekondigde) beslaglegging of inhouding d.d. ${violationDate} de toepasselijke beslagvrije voet niet correct is vastgesteld of wordt genegeerd.`;
    drawTextLines(intro, font, fontSize, 10);

    const bodyDetails = `Specificatie van de overtreding: ${details}`;
    drawTextLines(bodyDetails, font, fontSize, 10);

    const legal = `Op grond van artikel 475d van het Wetboek van Burgerlijke Rechtsvordering (Rv) geldt er een absolute bescherming van de beslagvrije voet. Het VTLB (Vrij Te Laten Bedrag) dient te allen tijde te worden gerespecteerd om het bestaansminimum van cliënt te waarborgen. Dit betekent dat het beslag op het inkomen of de bankrekening per direct dient te worden aangepast.`;
    drawTextLines(legal, font, fontSize, 10);

    const demand = `Wij verzoeken u - en voor zover nodig sommeren wij u - om binnen 5 werkdagen na heden de beslagvrije voet alsnog correct vast te stellen en toe te passen, en een eventueel ten onrechte geïncasseerd bedrag per omgaande te restitueren.`;
    drawTextLines(demand, font, fontSize, 10);

    const closing = `Indien deze situatie niet binnen de gestelde termijn is hersteld, zullen wij zonder nadere aankondiging rechtsmaatregelen treffen, waaronder het aanspannen van een executiegeschil, en zullen wij melding maken bij de toezichthoudende instanties. De kosten hiervan zullen op u worden verhaald.`;
    drawTextLines(closing, font, fontSize, 20);

    drawTextLines(`Hoogachtend,`, font, fontSize, 30);
    drawTextLines(`VTLB-Lock Systeem`, fontBold, fontSize, 0);
    drawTextLines(`(Geautomatiseerd verstuurd via RebuildYourLife)`, font, 9, 0);

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="bezwaar_beslagvrije_voet_${dossierNumber}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

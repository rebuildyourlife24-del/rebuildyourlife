import PDFDocument from 'pdfkit';

export class LegalService {
  /**
   * Generates a formal legal letter for a debt in PDF format.
   * @param debtId The ID of the debt.
   * @param type The type of letter to generate.
   * @returns A Promise resolving to a PDF Buffer.
   */
    public generateDebtLetter(debtId: string, type: 'PAYMENT_PLAN' | 'DISPUTE' | 'VTLB_LOCK', vtlbData?: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Letterhead / Title
        doc.fontSize(16).font('Helvetica-Bold').text('Officiële Correspondentie', { align: 'center' });
        doc.moveDown(2);
        
        // Metadata
        doc.fontSize(11).font('Helvetica');
        doc.text(`Datum: ${new Date().toLocaleDateString('nl-NL')}`);
        
        let subject = 'Betalingsregeling';
        if (type === 'DISPUTE') subject = 'Dispuut';
        if (type === 'VTLB_LOCK') subject = 'Mededeling Vrij Te Laten Bedrag (VTLB-Lock)';
        
        doc.text(`Betreft: ${subject} inzake dossier [${debtId}]`);
        doc.moveDown(2);
        
        doc.text('Geachte heer/mevrouw,');
        doc.moveDown();
        
        // Body based on type
        if (type === 'VTLB_LOCK') {
          doc.text('Hierbij informeer ik u dat de financiële situatie van uw debiteur is geanalyseerd en wettelijk is verankerd onder het Vrij Te Laten Bedrag (VTLB).');
          doc.moveDown();
          doc.text(`Volgens de meest recente berekening (Base Norm: €${vtlbData?.baseNorm || 'X'}, Wooncorrectie: €${vtlbData?.housingCorrection || 'X'}) bedraagt het vastgestelde VTLB €${vtlbData?.vtlbAmount || 'X'} per maand.`);
          doc.moveDown();
          doc.text(`Dit betekent dat er slechts een maximaal vatbaar bedrag van €${vtlbData?.seizableAmount || '0'} per maand beschikbaar is voor de totale schuldenlast. Ik verzoek u per direct alle incassomaatregelen te staken, aangezien er geen wettelijke aflossingscapaciteit resteert buiten dit vastgestelde bedrag. Elke poging om beslag te leggen onder het VTLB is onrechtmatig en zal juridisch worden aangevochten.`);
        } else if (type === 'PAYMENT_PLAN') {
          doc.text('Hierbij verzoek ik u vriendelijk om akkoord te gaan met een betalingsregeling voor het bovengenoemde dossiernummer. Vanwege onvoorziene financiële omstandigheden ben ik momenteel helaas niet in staat het volledige bedrag in één keer te voldoen.');
          doc.moveDown();
          doc.text('Ik stel voor om de openstaande schuld in vaste maandelijkse termijnen af te lossen, passend bij mijn huidige, vastgestelde aflossingscapaciteit. Ik stuur u de details van dit voorstel spoedig toe of bespreek dit graag met u verder om tot een minnelijke oplossing te komen.');
        } else {
          doc.text('Hierbij teken ik formeel bezwaar aan tegen de vordering onder het bovengenoemde dossiernummer. Ik betwist de juistheid van de vordering en verzoek u alle incassomaatregelen per direct op te schorten totdat deze kwestie grondig is opgehelderd.');
          doc.moveDown();
          doc.text('Graag ontvang ik van u binnen veertien dagen alle relevante onderliggende stukken (inclusief gespecificeerde facturen en eventuele contracten) die ten grondslag liggen aan deze vordering ter verificatie.');
        }
        
        doc.moveDown();
        doc.text('Ik ga ervan uit u hiermee voldoende te hebben geïnformeerd en zie uw schriftelijke reactie met belangstelling tegemoet.');
        doc.moveDown(2);
        
        // Closing
        doc.text('Hoogachtend,');
        doc.moveDown(2);
        doc.text('[Naam Afzender]');
        doc.text('RebuildYourLife OS');

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

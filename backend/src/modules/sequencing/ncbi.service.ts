import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface NcbiSummary {
  accession: string;
  title: string;
  organism: string;
  length: number;
}

@Injectable()
export class NcbiService {
  private readonly NCBI_BASE_URL =
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async fetchSummary(accession: string): Promise<NcbiSummary> {
    if (!accession || accession.trim().length === 0) {
      throw new BadRequestException('Accession number cannot be empty');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.NCBI_BASE_URL}/esummary.fcgi`, {
          params: {
            db: 'nuccore',
            id: accession.trim(),
            retmode: 'json',
            api_key: this.configService.get<string>('NCBI_API_KEY'),
          },
        }),
      );

      const result = response.data?.result;
      const uids = result?.uids;

      if (!result || !uids || uids.length === 0) {
        throw new BadRequestException(
          `Accession "${accession}" not found in NCBI`,
        );
      }

      const summary = result[uids[0]];
      if (!summary) {
        throw new BadRequestException(
          `Accession "${accession}" not found in NCBI`,
        );
      }

      return {
        accession: summary.accessionversion || summary.accession || accession,
        title: summary.title || 'Unknown title',
        organism: summary.organism || 'Unknown organism',
        length: summary.slen ? parseInt(summary.slen, 10) : 0,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch NCBI summary: ${error.message}`,
      );
    }
  }

  // Returns raw FASTA text content — caller decides where to store it
  async downloadFastaContent(accession: string): Promise<string> {
    await this.fetchSummary(accession);

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.NCBI_BASE_URL}/efetch.fcgi`, {
          params: {
            db: 'nuccore',
            id: accession.trim(),
            rettype: 'fasta',
            retmode: 'text',
            api_key: this.configService.get<string>('NCBI_API_KEY'),
          },
          responseType: 'text',
        }),
      );

      return response.data as string;
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to download FASTA from NCBI: ${error.message}`,
      );
    }
  }
}

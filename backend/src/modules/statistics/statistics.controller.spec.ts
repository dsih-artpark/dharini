import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { SitesService } from '../sites/sites.service';
import { SamplesService } from '../samples/samples.service';
import { DiseaseService } from '../disease/disease.service';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';

describe('StatisticsController', () => {
  let controller: StatisticsController;

  beforeEach(async () => {
    // Pre-existing gap: this scaffolded spec never kept pace with
    // StatisticsController's real constructor - none of its four injected
    // services (nor StatisticsService's own dependencies), nor the
    // route-level PoliciesGuard's own AbilityFactory dependency, were ever
    // provided, so this "should be defined" smoke test could never actually
    // resolve. Stubbed/overridden here rather than wired for real, since
    // nothing below exercises their behaviour.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        { provide: StatisticsService, useValue: {} },
        { provide: SitesService, useValue: {} },
        { provide: SamplesService, useValue: {} },
        { provide: DiseaseService, useValue: {} },
      ],
    })
      .overrideGuard(PoliciesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<StatisticsController>(StatisticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

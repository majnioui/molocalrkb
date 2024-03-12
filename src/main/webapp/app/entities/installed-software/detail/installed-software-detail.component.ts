import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IInstalledSoftware } from '../installed-software.model';

@Component({
  standalone: true,
  selector: 'jhi-installed-software-detail',
  templateUrl: './installed-software-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class InstalledSoftwareDetailComponent {
  @Input() installedSoftware: IInstalledSoftware | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}

import { TemplateRef, Type } from '@angular/core';

export type IccPortalContent<T> = string | TemplateRef<T> | Type<T>;


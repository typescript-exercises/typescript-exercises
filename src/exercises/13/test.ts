import {IsTypeEqual, typeAssert} from 'type-assertions';
import {dateWizard} from './index';

typeAssert<
    IsTypeEqual<
        dateWizard.DateDetails,
        {
            year: number;
            month: number;
            date: number;
            hours: number;
            minutes: number;
            seconds: number;
        }
    >
>();

typeAssert<
    IsTypeEqual<
        typeof dateWizard.pad,
        (level: number) => string
    >
>();

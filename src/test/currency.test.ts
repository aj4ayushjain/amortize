import { describe, it, expect, vi, afterEach } from 'vitest'
import { getDefaultCurrencyByLocale, getCurrencySymbol, formatNumberForDisplay } from '@/lib/currency'

function mockBrowser(timeZone: string, languages: string[]) {
  vi.spyOn(Intl, 'DateTimeFormat').mockReturnValue({
    resolvedOptions: () => ({ timeZone } as Intl.ResolvedDateTimeFormatOptions),
  } as Intl.DateTimeFormat)
  Object.defineProperty(navigator, 'languages', { value: languages, configurable: true })
}

describe('getDefaultCurrencyByLocale', () => {
  afterEach(() => vi.restoreAllMocks())

  // --- Non-EU currencies ---

  it('returns INR for Asia/Kolkata timezone', () => {
    mockBrowser('Asia/Kolkata', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('INR')
  })

  it('returns INR for hi-IN locale', () => {
    mockBrowser('America/New_York', ['hi-IN'])
    expect(getDefaultCurrencyByLocale()).toBe('INR')
  })

  it('returns BRL for America/Sao_Paulo timezone', () => {
    mockBrowser('America/Sao_Paulo', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('BRL')
  })

  it('returns BRL for pt-BR locale', () => {
    mockBrowser('America/Chicago', ['pt-BR'])
    expect(getDefaultCurrencyByLocale()).toBe('BRL')
  })

  it('returns JPY for Asia/Tokyo timezone', () => {
    mockBrowser('Asia/Tokyo', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('JPY')
  })

  it('returns RUB for Europe/Moscow timezone', () => {
    mockBrowser('Europe/Moscow', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('RUB')
  })

  it('returns RON for Europe/Bucharest timezone', () => {
    mockBrowser('Europe/Bucharest', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('RON')
  })

  it('returns GBP for Europe/London timezone', () => {
    mockBrowser('Europe/London', ['en-GB'])
    expect(getDefaultCurrencyByLocale()).toBe('GBP')
  })

  it('returns USD for America/* timezones', () => {
    mockBrowser('America/New_York', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('USD')
  })

  it('returns USD for America/Los_Angeles', () => {
    mockBrowser('America/Los_Angeles', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('USD')
  })

  it('returns AUD for Australia/Sydney', () => {
    mockBrowser('Australia/Sydney', ['en-AU'])
    expect(getDefaultCurrencyByLocale()).toBe('AUD')
  })

  it('returns CAD for Canada/ timezone prefix', () => {
    mockBrowser('Canada/Eastern', ['en-CA'])
    expect(getDefaultCurrencyByLocale()).toBe('CAD')
  })

  it('returns SGD for Asia/Singapore', () => {
    mockBrowser('Asia/Singapore', ['en-SG'])
    expect(getDefaultCurrencyByLocale()).toBe('SGD')
  })

  it('returns CNY for Asia/Shanghai', () => {
    mockBrowser('Asia/Shanghai', ['zh-CN'])
    expect(getDefaultCurrencyByLocale()).toBe('CNY')
  })

  it('returns ZAR for Africa/Johannesburg', () => {
    mockBrowser('Africa/Johannesburg', ['en-ZA'])
    expect(getDefaultCurrencyByLocale()).toBe('ZAR')
  })

  it('returns TRY for Europe/Istanbul', () => {
    mockBrowser('Europe/Istanbul', ['tr-TR'])
    expect(getDefaultCurrencyByLocale()).toBe('TRY')
  })

  it('returns HUF for Europe/Budapest', () => {
    mockBrowser('Europe/Budapest', ['hu-HU'])
    expect(getDefaultCurrencyByLocale()).toBe('HUF')
  })

  // --- Eurozone: timezone detection ---

  it('returns EUR for Europe/Vienna (Austria)', () => {
    mockBrowser('Europe/Vienna', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Brussels (Belgium)', () => {
    mockBrowser('Europe/Brussels', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Zagreb (Croatia)', () => {
    mockBrowser('Europe/Zagreb', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Asia/Nicosia (Cyprus)', () => {
    mockBrowser('Asia/Nicosia', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Asia/Famagusta (Cyprus)', () => {
    mockBrowser('Asia/Famagusta', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Tallinn (Estonia)', () => {
    mockBrowser('Europe/Tallinn', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Helsinki (Finland)', () => {
    mockBrowser('Europe/Helsinki', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Mariehamn (Finland — Åland Islands)', () => {
    mockBrowser('Europe/Mariehamn', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Paris (France)', () => {
    mockBrowser('Europe/Paris', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Berlin (Germany)', () => {
    mockBrowser('Europe/Berlin', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Busingen (Germany)', () => {
    mockBrowser('Europe/Busingen', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Athens (Greece)', () => {
    mockBrowser('Europe/Athens', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Dublin (Ireland)', () => {
    mockBrowser('Europe/Dublin', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Rome (Italy)', () => {
    mockBrowser('Europe/Rome', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Riga (Latvia)', () => {
    mockBrowser('Europe/Riga', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Vilnius (Lithuania)', () => {
    mockBrowser('Europe/Vilnius', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Luxembourg', () => {
    mockBrowser('Europe/Luxembourg', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Malta', () => {
    mockBrowser('Europe/Malta', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Amsterdam (Netherlands)', () => {
    mockBrowser('Europe/Amsterdam', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Lisbon (Portugal)', () => {
    mockBrowser('Europe/Lisbon', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Atlantic/Azores (Portugal)', () => {
    mockBrowser('Atlantic/Azores', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Atlantic/Madeira (Portugal)', () => {
    mockBrowser('Atlantic/Madeira', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Bratislava (Slovakia)', () => {
    mockBrowser('Europe/Bratislava', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Ljubljana (Slovenia)', () => {
    mockBrowser('Europe/Ljubljana', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Europe/Madrid (Spain)', () => {
    mockBrowser('Europe/Madrid', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for Atlantic/Canary (Spain — Canary Islands)', () => {
    mockBrowser('Atlantic/Canary', ['en-US'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  // --- Eurozone: locale detection ---

  it('returns EUR for de-AT locale (Austria)', () => {
    mockBrowser('America/New_York', ['de-AT'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for nl-BE locale (Belgium)', () => {
    mockBrowser('America/New_York', ['nl-BE'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for hr-HR locale (Croatia)', () => {
    mockBrowser('America/New_York', ['hr-HR'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for el-CY locale (Cyprus)', () => {
    mockBrowser('America/New_York', ['el-CY'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for et-EE locale (Estonia)', () => {
    mockBrowser('America/New_York', ['et-EE'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for fi-FI locale (Finland)', () => {
    mockBrowser('America/New_York', ['fi-FI'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for fr-FR locale (France)', () => {
    mockBrowser('America/New_York', ['fr-FR'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for de-DE locale (Germany)', () => {
    mockBrowser('America/New_York', ['de-DE'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for el-GR locale (Greece)', () => {
    mockBrowser('America/New_York', ['el-GR'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for en-IE locale (Ireland)', () => {
    mockBrowser('America/New_York', ['en-IE'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for ga-IE locale (Ireland — Irish)', () => {
    mockBrowser('America/New_York', ['ga-IE'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for it-IT locale (Italy)', () => {
    mockBrowser('America/New_York', ['it-IT'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for lv-LV locale (Latvia)', () => {
    mockBrowser('America/New_York', ['lv-LV'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for lt-LT locale (Lithuania)', () => {
    mockBrowser('America/New_York', ['lt-LT'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for lb-LU locale (Luxembourg — Luxembourgish)', () => {
    mockBrowser('America/New_York', ['lb-LU'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for mt-MT locale (Malta)', () => {
    mockBrowser('America/New_York', ['mt-MT'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for nl-NL locale (Netherlands)', () => {
    mockBrowser('America/New_York', ['nl-NL'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for pt-PT locale (Portugal)', () => {
    mockBrowser('America/New_York', ['pt-PT'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for sk-SK locale (Slovakia)', () => {
    mockBrowser('America/New_York', ['sk-SK'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for sl-SI locale (Slovenia)', () => {
    mockBrowser('America/New_York', ['sl-SI'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for es-ES locale (Spain)', () => {
    mockBrowser('America/New_York', ['es-ES'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for ca-ES locale (Spain — Catalan)', () => {
    mockBrowser('America/New_York', ['ca-ES'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for eu-ES locale (Spain — Basque)', () => {
    mockBrowser('America/New_York', ['eu-ES'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns EUR for gl-ES locale (Spain — Galician)', () => {
    mockBrowser('America/New_York', ['gl-ES'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  // --- Locale takes priority when timezone is ambiguous ---

  it('locale match beats unknown timezone fallback', () => {
    mockBrowser('Pacific/Unknown', ['nl-NL'])
    expect(getDefaultCurrencyByLocale()).toBe('EUR')
  })

  it('returns INR as last-resort fallback for unrecognised timezone and locale', () => {
    mockBrowser('Pacific/Fakezone', ['xx-XX'])
    expect(getDefaultCurrencyByLocale()).toBe('INR')
  })
})

describe('getCurrencySymbol', () => {
  it('returns correct symbol for known codes', () => {
    expect(getCurrencySymbol('INR')).toBe('₹')
    expect(getCurrencySymbol('USD')).toBe('$')
    expect(getCurrencySymbol('EUR')).toBe('€')
    expect(getCurrencySymbol('GBP')).toBe('£')
  })

  it('returns $ for unknown code', () => {
    expect(getCurrencySymbol('XYZ')).toBe('$')
  })
})

describe('formatNumberForDisplay', () => {
  it('formats INR with Indian grouping', () => {
    expect(formatNumberForDisplay('1000000', 'INR')).toBe('10,00,000')
  })

  it('formats USD with standard grouping', () => {
    expect(formatNumberForDisplay('1000000', 'USD')).toBe('1,000,000')
  })

  it('returns empty string for empty input', () => {
    expect(formatNumberForDisplay('', 'USD')).toBe('')
  })
})

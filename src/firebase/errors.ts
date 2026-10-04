export function getHinglishAuthErrorMessage(codeOrMessage: string): string {
  const code = codeOrMessage.toLowerCase();

  if (code.includes('user-not-found')) {
    return 'Ye email Orbit pe registered nahi hai cadet. Pehle account bana lo!';
  }
  if (code.includes('wrong-password') || code.includes('invalid-credential')) {
    return 'Email ya password sahi nahi hai. Ek baar verify kar lo ya forgot password karo.';
  }
  if (code.includes('email-already-in-use')) {
    return 'Ye email pehle se registered hai! Direct login kar sakte ho.';
  }
  if (code.includes('weak-password')) {
    return 'Password thoda strong rakho — kam se kam 6 characters hone chahiye.';
  }
  if (code.includes('invalid-email')) {
    return 'Email format check karo cadet. Sahi format zaroori hai.';
  }
  if (code.includes('network-request-failed')) {
    return 'Internet connection check karo. Orbit offline mode me kaam kar raha hai.';
  }
  if (code.includes('too-many-requests')) {
    return 'Thoda sa saans lo! Bahut saare attempts ho gaye, kuch der baad try karo.';
  }
  if (code.includes('popup-closed-by-user')) {
    return 'Google login popup band ho gaya tha. Dobara try karo.';
  }
  
  return 'Kuch gadbad ho gayi cadet. Dobara try karo ya network check karo.';
}

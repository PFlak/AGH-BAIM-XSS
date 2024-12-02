const sanitizeInput = (input: string): string => {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
      };
    
      const reg: RegExp = /[&<>"'/]/g;
    
      return input.replace(reg, (match: string): string => map[match]);
}

export default sanitizeInput;
import { TextField } from '@fluentui/react';
import { Label } from '@microsoft/designer-ui';
import type React from 'react';

export interface ClientSecretInputProps {
  isLoading: boolean | undefined;
  parameterKey: string;
  setValue: (value: any) => void;
  value: any;
}

export interface IClientCertificateMetadata {
  pfx: string;
  password: string;
}

async function getBase64String(file: File): Promise<string> {
  return new Promise<string>((resolve, reject): void => {
    const reader = new FileReader();
    reader.onload = () => {
      const binaryData = reader.result as ArrayBuffer;
      const bytes = Array.from(new Uint8Array(binaryData));
      const base64String = btoa(bytes.map((item) => String.fromCharCode(item)).join(''));
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

const ClientSecretInput = (props: ClientSecretInputProps) => {
  const { parameterKey, setValue } = props;

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      getBase64String(file).then((fileContent: string) => {
        // setValue((value: IClientCertificateMetadata) => {
        //     value.pfx = fileContent;
        //     return value;
        // });
        setValue({ pfx: fileContent });
      });
    }
  };

  return (
    <div style={{ width: 'inherit' }}>
      <Label text={'Upload PFX File'} htmlFor={`${parameterKey}-pfxFileInput`} isRequiredField={true} requiredMarkerSide={'right'} />
      <input className="connection-parameter-input" type="file" id={`${parameterKey}-pfxFileInput`} accept=".pfx" onChange={onFileChange} />
      <Label text={'Password'} htmlFor={`${parameterKey}-pfxPasswordInput`} isRequiredField={false} />
      <TextField
        type="password"
        id={`${parameterKey}-pfxPasswordInput`}
        className="connection-parameter-input"
        autoComplete="off"
        rows={1}
        multiline={false}
        placeholder="(Optional) Password for PFX file"
      />
    </div>
  );
};

export default ClientSecretInput;

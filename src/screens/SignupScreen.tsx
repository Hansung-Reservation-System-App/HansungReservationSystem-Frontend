import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image
} from 'react-native';

export default function SignupScreen() {
  const [studentId, setStudentId] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = studentId && pw.length >= 4 && pw === confirmPw && !loading;

  const onSignup = async () => {
    setLoading(true);
    try {
      // 여기에 회원가입 API 호출 부분 추가 예정
      // 예시: 
      // const response = await axios.post('http://your-api-endpoint', {
      //   userId: studentId,
      //   password: pw,
      // });

      // 서버 연결 준비 중이라서 일단 성공 알림만 띄움
      Alert.alert('회원가입 성공', '회원가입이 완료되었습니다!');
    } catch (error) {
      console.error(error);
      Alert.alert('회원가입 실패', '서버에 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.wrap}>
      <View style={s.logoContainer}>
        <Image
        source={require('../images/hansung.png')}
        style={s.logo}
        resizeMode="contain"
        />
      </View>

      <Text style={s.title}>회원가입</Text>

      <View style={s.field}>
        <Text style={s.label}>학번</Text>
        <TextInput
          value={studentId}
          onChangeText={setStudentId}
          placeholder="2023123"
          keyboardType="numeric"
          style={s.input}
          editable={!loading}
        />
      </View>

      <View style={s.field}>
        <Text style={s.label}>비밀번호</Text>
        <TextInput
          value={pw}
          onChangeText={setPw}
          placeholder="••••••"
          secureTextEntry={true}
          style={s.input}
          editable={!loading}
        />
        <Text style={s.hint}>4자 이상 입력해 주세요.</Text>
      </View>

      <View style={s.field}>
        <Text style={s.label}>비밀번호 확인</Text>
        <TextInput
          value={confirmPw}
          onChangeText={setConfirmPw}
          placeholder="••••••"
          secureTextEntry={true}
          style={s.input}
          editable={!loading}
        />
        <Text style={s.hint}>비밀번호를 확인해 주세요.</Text>
      </View>

      <TouchableOpacity
        onPress={onSignup}
        disabled={!canSubmit}
        style={[s.primaryBtn, !canSubmit && { opacity: 0.5 }]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.primaryText}>회원가입</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 24,
    color: '#111',
    textAlign: 'center',
  },
  field: { marginBottom: 16 },
  label: { fontSize: 14, color: '#555', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  hint: { marginTop: 6, color: '#999', fontSize: 12 },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: '#2e6bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

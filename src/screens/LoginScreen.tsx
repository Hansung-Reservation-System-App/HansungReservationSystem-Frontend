import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Image } from 'react-native';

export default function LoginScreen({ navigation }: any) {
  const [studentId, setStudentId] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    const idOk = /^\d{7}$/.test(studentId.trim()); // 7자리 숫자
    const pwOk = pw.length >= 4;
    return idOk && pwOk && !loading;
  }, [studentId, pw, loading]);

  const onLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://10.0.2.2:8080/api/users/login', {
      userId: studentId,  // Swagger에 맞게 userId로 수정
      password: pw,       // 비밀번호는 그대로 전달
    });

      if (response.data.isSucess) {
        const userIdFromServer = response.data.data.userId; // 실제 구조에 맞게 수정
        navigation.navigate('Home', { userId: userIdFromServer });
      } else {
        Alert.alert('로그인 실패', '서버 응답 오류');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('로그인 실패', '서버에 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onSignup = () => {
    navigation.navigate('Signup');  // 회원가입 화면으로 네비게이션 이동
  };

  const onFindPw = () => {
    navigation.navigate('PasswordRecovery');  // 비밀번호 찾기 화면으로 이동
  };

  return (
    <View style={s.wrap}>
      {/* 상단 학교 로고 */}
      <View style={s.logoContainer}>
        <Image
          source={require('../images/hansung.png')}
          style={s.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={s.title}>로그인</Text>

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
        <View style={s.row}>
          <TextInput
            value={pw}
            onChangeText={setPw}
            placeholder="••••••"
            secureTextEntry={!showPw}
            style={[s.input, { flex: 1, marginBottom: 0 }]}
            editable={!loading}
          />
          <TouchableOpacity
            style={s.eyeBtn}
            onPress={() => setShowPw((v) => !v)}
            disabled={loading}
          >
            <Text style={s.eyeText}>{showPw ? 'HIDE' : 'SHOW'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.hint}>4자 이상 입력해 주세요.</Text>
      </View>

      <TouchableOpacity
        onPress={onLogin}
        disabled={!canSubmit}
        style={[s.primaryBtn, !canSubmit && { opacity: 0.5 }]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.primaryText}>로그인</Text>
        )}
      </TouchableOpacity>

      {/* 회원가입 / 비밀번호 찾기 */}
      <View style={s.bottomLinks}>
        <TouchableOpacity onPress={onSignup} disabled={loading}>
          <Text style={s.linkText}>회원가입</Text>
        </TouchableOpacity>
        <View style={s.separator} />
        <TouchableOpacity onPress={onFindPw} disabled={loading}>
          <Text style={s.linkText}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
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
  row: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f1f1f5',
  },
  eyeText: { fontSize: 12, color: '#333', fontWeight: '600' },
  hint: { marginTop: 6, color: '#999', fontSize: 12 },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: '#2e6bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#2e6bff',
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: '#ccc',
    marginHorizontal: 12,
  },
});
